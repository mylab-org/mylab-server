import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUpdateCommentRequestDto } from './dto/request/create-update-comment.request.dto.js';
import { COMMENT_ERROR } from './constants/comment.error.js';
import { Prisma } from '@prisma/client';

const authorSelect = {
  select: {
    name: true,
    lab_members: {
      where: { left_at: null },
      take: 1,
      select: { labs: { select: { name: true } } },
    },
  },
} as const;

export const commentInclude = {
  author: authorSelect,
  replies: {
    include: {
      author: authorSelect,
    },
    orderBy: { created_at: 'asc' },
  },
} as const; // as const를 붙여야 Prisma가 타입을 정확히 추론합니다.

export type CommentWithReplies = Prisma.commentsGetPayload<{ include: typeof commentInclude }>;

export type CommentView = CommentWithReplies & { is_mine: boolean };

type AnonymousContext = {
  userId: bigint;
  postAuthorId: bigint;
  isPostAnonymous: boolean;
  anonymousNumbers: Map<bigint, number>;
};

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getComment(userId: number, pid: number): Promise<CommentView[]> {
    const post = await this.prisma.posts.findUnique({
      where: { id: BigInt(pid) },
      select: { category_id: true, author_id: true, is_anonymous: true }, // 게시글의 카테고리 ID 추출
    });

    if (!post) throw new NotFoundException(COMMENT_ERROR.BOARD_NOT_FOUND);

    // 2. 접근 권한 체크 (기존에 만드신 함수 활용)
    await this.chkUserAccessComment(userId, Number(post.category_id));

    const [comments, anonymousNumbers] = await Promise.all([
      this.prisma.comments.findMany({
        where: { post_id: BigInt(pid), parent_id: null },
        include: commentInclude,
        orderBy: { created_at: 'asc' },
      }),
      this.prisma.post_anonymous_numbers.findMany({
        where: { post_id: BigInt(pid) },
        select: { user_id: true, number: true },
      }),
    ]);

    const ctx: AnonymousContext = {
      userId: BigInt(userId),
      postAuthorId: post.author_id,
      isPostAnonymous: post.is_anonymous,
      anonymousNumbers: new Map(anonymousNumbers.map((a) => [a.user_id, a.number])),
    };

    // map을 통해 가공된 배열을 반환합니다.
    return comments.map((comment) => this.maskComment(comment, ctx));
  }

  private maskComment(comment: CommentWithReplies, ctx: AnonymousContext): CommentView {
    // 공통으로 처리할 대댓글 재귀 로직
    const processedReplies =
      comment.replies?.map((reply) => this.maskComment(reply as CommentWithReplies, ctx)) || [];

    if (comment.deleted_at !== null) {
      // 삭제된 댓글일 경우: 새로운 객체를 만들어서 반환 (타입 충돌 회피)
      return {
        ...comment,
        content: '삭제된 댓글입니다.',
        author: {
          name: '',
          lab_members: [],
        },
        is_mine: false,
        replies: processedReplies,
      };
    }

    // 삭제되지 않은 댓글일 경우: 익명이면 작성자 정보를 가리고, 가공된 대댓글로 교체
    return {
      ...comment,
      author: comment.is_anonymous
        ? { name: this.getAnonymousName(comment.author_id, ctx), lab_members: [] }
        : comment.author,
      is_mine: comment.author_id === ctx.userId,
      replies: processedReplies,
    };
  }

  private getAnonymousName(authorId: bigint, ctx: AnonymousContext) {
    const number = ctx.anonymousNumbers.get(authorId);

    // 익명 게시글이었을 때 번호 없이 작성한 글쓴이 댓글은 게시글이 실명으로 바뀌어도 글쓴이로 표시
    if (authorId === ctx.postAuthorId && (ctx.isPostAnonymous || !number)) return '익명(글쓴이)';

    return number ? `익명${number}` : '익명';
  }

  private async assignAnonymousNumber(postId: bigint, userId: bigint): Promise<number> {
    // 동시에 같은 번호를 받으려 하면 (post_id, number) 유니크 제약에 걸리므로 재시도
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const existing = await tx.post_anonymous_numbers.findUnique({
            where: { post_id_user_id: { post_id: postId, user_id: userId } },
          });
          if (existing) return existing.number;

          const max = await tx.post_anonymous_numbers.aggregate({
            where: { post_id: postId },
            _max: { number: true },
          });

          const created = await tx.post_anonymous_numbers.create({
            data: { post_id: postId, user_id: userId, number: (max._max.number ?? 0) + 1 },
          });
          return created.number;
        });
      } catch (e) {
        const isConflict = e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';
        if (!isConflict || attempt >= 2) throw e;
      }
    }
  }

  async createComment(userId: number, pid: number, dto: CreateUpdateCommentRequestDto) {
    // 1. 게시글 존재 확인 (선택 사항이지만 안전함)
    const post = await this.prisma.posts.findUnique({ where: { id: BigInt(pid) } });
    if (!post) throw new NotFoundException(COMMENT_ERROR.BOARD_NOT_FOUND);

    await this.chkUserAccessComment(userId, Number(post.category_id));

    // 2. 만약 대댓글(parentId가 있음)이라면 부모 댓글이 존재하는지 확인
    if (dto.parentId) {
      const parent = await this.prisma.comments.findUnique({
        where: { id: BigInt(dto.parentId) },
      });
      if (!parent) throw new NotFoundException(COMMENT_ERROR.PARENT_COMMENT_NOT_FOUND);
    }

    // 익명 게시글의 작성자는 '익명(글쓴이)'로 표시되므로 번호를 받지 않음
    const isPostWriter = post.is_anonymous && post.author_id === BigInt(userId);
    if (dto.isAnonymous && !isPostWriter) {
      await this.assignAnonymousNumber(post.id, BigInt(userId));
    }

    return this.prisma.comments.create({
      data: {
        content: dto.content,
        post_id: BigInt(pid),
        author_id: BigInt(userId),
        parent_id: dto.parentId ? BigInt(dto.parentId) : null,
        is_anonymous: dto.isAnonymous ?? false,
      },
    });
  }

  async updateComment(userId: number, cid: number, dto: CreateUpdateCommentRequestDto) {
    // 1. 댓글 존재 및 권한 확인
    const comment = await this.prisma.comments.findUnique({
      where: { id: BigInt(cid) },
    });

    console.log(comment);

    if (!comment) throw new NotFoundException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    if (comment.deleted_at) throw new BadRequestException(COMMENT_ERROR.COMMENT_DELETE);

    // 작성자 체크
    if (comment.author_id !== BigInt(userId)) {
      throw new ForbiddenException(COMMENT_ERROR.BOARD_PERMISSION_DENIED);
    }

    return this.prisma.comments.update({
      where: { id: BigInt(cid) },
      data: {
        content: dto.content,
      },
    });
  }

  async deleteComment(userId: number, cid: number) {
    // 1. 댓글 존재 및 권한 확인
    const comment = await this.prisma.comments.findUnique({
      where: { id: BigInt(cid) },
    });

    if (!comment) throw new NotFoundException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    if (comment.deleted_at) throw new BadRequestException(COMMENT_ERROR.COMMENT_DELETE);
    if (comment.author_id !== BigInt(userId)) {
      throw new ForbiddenException(COMMENT_ERROR.BOARD_PERMISSION_DENIED);
    }

    // 2. 삭제 실행
    await this.prisma.comments.update({
      where: { id: BigInt(cid) },
      data: { deleted_at: new Date() }, // 현재 시간 저장
    });

    return '댓글이 삭제되었습니다.';
  }

  private async chkUserAccessComment(userId: number, categoryId: number) {
    const category = await this.prisma.board_categories.findFirst({
      where: {
        id: BigInt(categoryId),
      },
    });

    if (!category) throw new NotFoundException(COMMENT_ERROR.CATEGORIES_NOT_FOUND);

    if (category.lab_id !== null) {
      const member = await this.prisma.lab_members.findFirst({
        where: {
          user_id: BigInt(userId),
          lab_id: category.lab_id,
          left_at: null, //탈퇴 멤버는 제외
        },
      });

      if (!member) throw new ForbiddenException(COMMENT_ERROR.CATEGORIES_PERMISSION_DENIED);
    }
  }
}

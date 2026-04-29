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

export const commentInclude = {
  author: { select: { name: true } },
  replies: {
    include: {
      author: { select: { name: true } },
    },
  },
} as const; // as const를 붙여야 Prisma가 타입을 정확히 추론합니다.

export type CommentWithReplies = Prisma.commentsGetPayload<{ include: typeof commentInclude }>;

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getComment(userId: number, pid: number): Promise<CommentWithReplies[]> {
    const comments = await this.prisma.comments.findMany({
      where: { post_id: BigInt(pid), parent_id: null },
      include: commentInclude,
      orderBy: { created_at: 'asc' },
    });

    // map을 통해 가공된 배열을 반환합니다.
    return comments.map((comment) => this.maskDeletedComment(comment));
  }

  private maskDeletedComment(comment: CommentWithReplies): CommentWithReplies {
    // 공통으로 처리할 대댓글 재귀 로직
    const processedReplies =
      comment.replies?.map((reply) => this.maskDeletedComment(reply as CommentWithReplies)) || [];

    if (comment.deleted_at !== null) {
      // 삭제된 댓글일 경우: 새로운 객체를 만들어서 반환 (타입 충돌 회피)
      return {
        ...comment,
        content: '삭제된 댓글입니다.',
        author: {
          name: '',
        },
        replies: processedReplies,
      };
    }

    // 삭제되지 않은 댓글일 경우: 원본 데이터 유지하되 가공된 대댓글만 교체
    return {
      ...comment,
      replies: processedReplies,
    };
  }

  async createComment(userId: number, pid: number, dto: CreateUpdateCommentRequestDto) {
    // 1. 게시글 존재 확인 (선택 사항이지만 안전함)
    const post = await this.prisma.posts.findUnique({ where: { id: BigInt(pid) } });
    if (!post) throw new NotFoundException(COMMENT_ERROR.BOARD_NOT_FOUND);

    // 2. 만약 대댓글(parentId가 있음)이라면 부모 댓글이 존재하는지 확인
    if (dto.parentId) {
      const parent = await this.prisma.comments.findUnique({
        where: { id: BigInt(dto.parentId) },
      });
      if (!parent) throw new NotFoundException(COMMENT_ERROR.PARENT_COMMENT_NOT_FOUND);
    }

    return this.prisma.comments.create({
      data: {
        content: dto.content,
        post_id: BigInt(pid),
        author_id: BigInt(userId),
        parent_id: dto.parentId ? BigInt(dto.parentId) : null,
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

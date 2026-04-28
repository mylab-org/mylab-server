import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUpdateCommentRequestDto } from './dto/request/create-update-comment.request.dto.js';
import { COMMENT_ERROR } from './constants/comment.error.js';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getComment(userId: number, pid: number) {
    // 1. 해당 게시글의 댓글만 조회
    const comments = await this.prisma.comments.findMany({
      where: {
        post_id: BigInt(pid),
        parent_id: null, // 최상위 댓글만 먼저 조회 (대댓글은 include로 가져옴)
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            degree: true,
          },
        },
        replies: {
          // 대댓글(자식) 포함
          include: {
            author: {
              select: {
                id: true,
                name: true,
                degree: true,
              },
            },
          },
          orderBy: {
            created_at: 'asc', // 대댓글은 작성순
          },
        },
      },
      orderBy: {
        created_at: 'asc', // 댓글도 작성순 (보통 댓글은 오래된 게 위로 감)
      },
    });

    return comments;
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

    if (!comment) throw new NotFoundException(COMMENT_ERROR.COMMENT_NOT_FOUND);

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

    if (!comment) throw new NotFoundException('댓글이 존재하지 않습니다.');

    if (comment.author_id !== BigInt(userId)) {
      throw new ForbiddenException(COMMENT_ERROR.BOARD_PERMISSION_DENIED);
    }

    // 2. 삭제 실행
    await this.prisma.comments.delete({
      where: { id: BigInt(cid) },
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

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CategoryItemDto,
  GetCategoryResponseDto,
} from './dto/response/get-category.response.dto.js';
import { CreateUpdateBoardRequest } from './dto/request/create-update-board.request.dto.js';
import { BOARD_ERROR } from './constants/board.error.js';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async getCategory(userId: number, labId: number): Promise<GetCategoryResponseDto> {
    const labWithMember = await this.prisma.labs.findUnique({
      where: { id: BigInt(labId) },
      include: {
        lab_members: {
          where: {
            user_id: BigInt(userId),
            left_at: null,
          },
        },
      },
    });

    // [구분 1] 연구실 자체가 존재하지 않는 경우
    if (!labWithMember) {
      throw new NotFoundException(BOARD_ERROR.LAB_NOT_FOUND);
    }

    // [구분 2] 연구실은 존재하지만, 내가 활성화된 멤버가 아닌 경우
    if (labWithMember.lab_members.length === 0) {
      throw new ForbiddenException(BOARD_ERROR.USER_NOT_FOUND);
    }

    const category = await this.prisma.board_categories.findMany({
      where: {
        OR: [{ lab_id: null }, { lab_id: BigInt(labId) }],
      },
      orderBy: {
        id: 'asc',
      },
    });

    return category.reduce(
      (acc, cur) => {
        const item: CategoryItemDto = {
          category_id: cur.id.toString(),
          category_name: cur.name,
        };

        if (cur.lab_id === null) acc.service.push(item);
        else acc.lab.push(item);

        return acc;
      },
      { service: [], lab: [] } as GetCategoryResponseDto,
    );
  }

  async getBoard(userId: number, categoryId: number, page: number = 1, pageSize: number = 20) {
    // 1. 게시판 접근 권한 확인
    await this.chkUserAccessBoard(userId, categoryId);

    // 1. 전체 게시글 개수와 목록 조회를 병렬로 실행
    const [posts, totalCount] = await this.prisma.$transaction([
      this.prisma.posts.findMany({
        where: { category_id: BigInt(categoryId) },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              degree: true,
              lab_members: {
                // <--- 이 부분이 DTO의 Transform에서 사용됨
                where: { left_at: null },
                take: 1,
                select: {
                  labs: { select: { id: true, name: true } },
                },
              },
            },
          },
          _count: {
            select: { comments: true }, // 전체 댓글 개수만 따로 확인하고 싶을 때
          },
        },
      }),
      this.prisma.posts.count({
        where: { category_id: BigInt(categoryId) },
      }),
    ]);

    return {
      posts,
      page: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async createBoard(userId: number, categoryId: number, boardDto: CreateUpdateBoardRequest) {
    await this.chkUserAccessBoard(userId, categoryId);

    return this.prisma.posts.create({
      data: {
        title: boardDto.title,
        content: boardDto.content,
        category_id: BigInt(categoryId),
        author_id: BigInt(userId),
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        updated_at: true,
        like_count: true,
        author: {
          select: {
            id: true,
            name: true,
            degree: true,
            lab_members: {
              where: { left_at: null },
              take: 1, // 가장 최근 혹은 첫 번째 소속 정보만 가져옴
              select: {
                labs: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateBoard(userId: number, pid: number, boardDto: CreateUpdateBoardRequest) {
    await this.chkUserPostAuthor(userId, pid);

    // 2. 트랜잭션을 사용하여 게시글 수정 및 이미지 업데이트를 동시에 처리
    return this.prisma.$transaction(async (tx) => {
      // 2-1. 게시글 본문 수정
      await tx.posts.update({
        where: { id: BigInt(pid) },
        data: {
          title: boardDto.title,
          content: boardDto.content,
          updated_at: new Date(), // 수동 업데이트 (스키마 설정에 따라 생략 가능)
        },
      });

      // 2-2. 이미지 업데이트 로직 (Img 배열이 존재할 경우)
      if (boardDto.Img) {
        // 기존 이미지 삭제 (전체 교체 방식)
        await tx.post_images.deleteMany({
          where: { post_id: BigInt(pid) },
        });

        // 새로운 이미지 등록
        if (boardDto.Img.length > 0) {
          await tx.post_images.createMany({
            data: boardDto.Img.map((url, index) => ({
              post_id: BigInt(pid),
              image_url: url,
              order: index,
            })),
          });
        }
      }

      return '게시글이 수정되었습니다.';
    });
  }

  async deleteBoard(userId: number, pid: number) {
    await this.chkUserPostAuthor(userId, pid);

    // 2. 게시글 삭제 실행
    // 스키마에 onDelete: Cascade가 설정되어 있다면 posts만 지워도
    // 관련 post_images, comments가 자동으로 삭제됩니다.
    await this.prisma.posts.delete({
      where: {
        id: BigInt(pid),
      },
    });

    return '게시글이 삭제되었습니다.';
  }

  private async chkUserAccessBoard(userId: number, categoryId: number) {
    const category = await this.prisma.board_categories.findFirst({
      where: {
        id: BigInt(categoryId),
      },
    });

    if (!category) throw new NotFoundException(BOARD_ERROR.CATEGORIES_NOT_FOUND);

    if (category.lab_id !== null) {
      const member = await this.prisma.lab_members.findFirst({
        where: {
          user_id: BigInt(userId),
          lab_id: category.lab_id,
          left_at: null, //탈퇴 멤버는 제외
        },
      });

      if (!member) throw new ForbiddenException(BOARD_ERROR.CATEGORIES_PERMISSION_DENIED);
    }
  }

  private async chkUserPostAuthor(userId: number, pid: number) {
    const post = await this.prisma.posts.findFirst({
      where: {
        id: BigInt(pid),
      },
    });
    if (!post) throw new NotFoundException(BOARD_ERROR.BOARD_NOT_FOUND);
    if (post.author_id !== BigInt(userId))
      throw new ForbiddenException(BOARD_ERROR.BOARD_PERMISSION_DENIED);
  }
}

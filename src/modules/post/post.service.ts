import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { PaginationUtil } from "../../common/utils/pagination.util";
import { ResponseUtil } from "../../common/utils/response.util";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  private transformPost(post: any) {
    if (post._count) {
      return {
        ...post,
        likesCount: post._count.likes,
        repostsCount: post._count.reposts,
        repliesCount: post._count.replies,
        _count: undefined,
      };
    }
    return post;
  }

  async getPosts(page: number = 1, limit: number = 10) {
    const skip = PaginationUtil.calculateSkip(page, limit);
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              handle: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              reposts: true,
              replies: true,
            },
          },
        },
      }),
      this.prisma.post.count(),
    ]);

    const pagination = PaginationUtil.calculatePagination(page, limit, total);
    return ResponseUtil.success({
      posts: posts.map((post) => this.transformPost(post)),
      pagination,
    });
  }

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const { content, image } = createPostDto;
    const post = await this.prisma.post.create({
      data: { content, image, userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            handle: true,
            avatar: true,
          },
        },
      },
    });
    return ResponseUtil.success({ post }, "创建帖子成功");
  }

  async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            handle: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            reposts: true,
            replies: true,
          },
        },
      },
    });
    if (!post) {
      throw new NotFoundException("帖子不存在");
    }
    return ResponseUtil.success({ post: this.transformPost(post) });
  }

  async updatePost(id: string, updateData: CreatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException("帖子不存在");
    }
    if (post.userId !== userId) {
      throw new ForbiddenException("无权修改此帖子");
    }
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            handle: true,
            avatar: true,
          },
        },
      },
    });
    return ResponseUtil.success({ post: updatedPost }, "帖子更新成功");
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException("帖子不存在");
    }
    if (post.userId !== userId) {
      throw new ForbiddenException("无权删除此帖子");
    }
    await this.prisma.post.delete({ where: { id } });
    return ResponseUtil.successWithMessage("帖子已删除");
  }

  async likePost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException("帖子不存在");
    }
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId: id } },
    });
    if (existingLike) {
      throw new ForbiddenException("已经点赞过此帖子");
    }
    await this.prisma.like.create({
      data: { postId: id, userId },
    });
    return ResponseUtil.successWithMessage("点赞成功");
  }

  async unlikePost(id: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId: id } },
    });
    if (!like) {
      throw new NotFoundException("未点赞此帖子");
    }
    await this.prisma.like.delete({
      where: { userId_postId: { userId, postId: id } },
    });
    return ResponseUtil.successWithMessage("取消点赞成功");
  }

  async repostPost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException("帖子不存在");
    }
    const existingRepost = await this.prisma.repost.findUnique({
      where: { userId_postId: { userId, postId: id } },
    });
    if (existingRepost) {
      throw new ForbiddenException("已经转发过此帖子");
    }
    await this.prisma.repost.create({
      data: { postId: id, userId },
    });
    return ResponseUtil.successWithMessage("转发成功");
  }
}

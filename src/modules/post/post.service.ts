import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getPosts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
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

    return {
      success: true,
      data: {
        posts: posts.map((post) => ({
          ...post,
          likesCount: post._count.likes,
          repostsCount: post._count.reposts,
          repliesCount: post._count.replies,
          _count: undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
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
    return {
      success: true,
      data: { post },
      message: "创建帖子成功",
    };
  }
}

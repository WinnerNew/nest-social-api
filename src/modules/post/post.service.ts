import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getPosts() {
    const posts = await this.prisma.post.findMany({
      include: {
        user: true,
        likes: true,
        reposts: true,
        replies: true,
      },
    });
    return {
      success: true,
      data: { posts },
    };
  }

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const { content, image } = createPostDto;
    const post = await this.prisma.post.create({
      data: { content, image, userId },
      include: {
        user: true,
      },
    });
    return {
      success: true,
      data: { post },
      message: "创建帖子成功",
    };
  }
}

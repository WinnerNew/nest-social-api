import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return {
      success: true,
      data: {
        users: users.map((user) => ({
          id: user.id,
          username: user.username,
          handle: user.handle,
          avatar: user.avatar,
          createdAt: user.createdAt,
        })),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("用户不存在");
    }
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          handle: user.handle,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    };
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      username: user.username,
      handle: user.handle,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }

  async getUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);

    return {
      success: true,
      data: {
        users: users.map((user) => this.sanitizeUser(user)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
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
        user: this.sanitizeUser(user),
      },
    };
  }

  async updateUser(id: string, updateData: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return {
      success: true,
      data: {
        user: this.sanitizeUser(user),
      },
    };
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return {
      success: true,
      message: "用户已删除",
    };
  }
}

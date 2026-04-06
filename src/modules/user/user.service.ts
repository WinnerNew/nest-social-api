import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { PaginationUtil } from "../../common/utils/pagination.util";
import { ResponseUtil } from "../../common/utils/response.util";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      handle: user.handle,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }

  async getUsers(page: number = 1, limit: number = 10) {
    const skip = PaginationUtil.calculateSkip(page, limit);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);

    const pagination = PaginationUtil.calculatePagination(page, limit, total);
    return ResponseUtil.success({
      users: users.map((user) => this.sanitizeUser(user)),
      pagination,
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("用户不存在");
    }
    return ResponseUtil.success({ user: this.sanitizeUser(user) });
  }

  async updateUser(id: string, updateData: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return ResponseUtil.success({ user: this.sanitizeUser(user) });
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return ResponseUtil.successWithMessage("用户已删除");
  }
}

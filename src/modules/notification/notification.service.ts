import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { PaginationUtil } from "../../common/utils/pagination.util";
import { ResponseUtil } from "../../common/utils/response.util";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  private getNotificationInclude() {
    return {
      actor: {
        select: {
          id: true,
          username: true,
          handle: true,
          avatar: true,
        },
      },
      post: {
        select: {
          id: true,
          content: true,
        },
      },
    };
  }

  async getNotifications(userId: string, page: number = 1, limit: number = 10) {
    const skip = PaginationUtil.calculateSkip(page, limit);
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { recipientId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: this.getNotificationInclude(),
      }),
      this.prisma.notification.count({ where: { recipientId: userId } }),
    ]);

    const pagination = PaginationUtil.calculatePagination(page, limit, total);
    return ResponseUtil.success({ notifications, pagination });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException("通知不存在");
    }

    if (notification.recipientId !== userId) {
      throw new ForbiddenException("无权操作此通知");
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return ResponseUtil.success(
      { notification: updatedNotification },
      "标记已读成功"
    );
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true },
    });
    return ResponseUtil.successWithMessage("全部标记已读成功");
  }

  async getNotificationById(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: this.getNotificationInclude(),
    });
    if (!notification) {
      throw new NotFoundException("通知不存在");
    }
    if (notification.recipientId !== userId) {
      throw new ForbiddenException("无权查看此通知");
    }
    return ResponseUtil.success({ notification });
  }

  async deleteNotification(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException("通知不存在");
    }
    if (notification.recipientId !== userId) {
      throw new ForbiddenException("无权删除此通知");
    }
    await this.prisma.notification.delete({ where: { id } });
    return ResponseUtil.successWithMessage("通知已删除");
  }
}

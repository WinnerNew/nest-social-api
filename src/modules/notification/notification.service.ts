import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { recipientId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
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
        },
      }),
      this.prisma.notification.count({
        where: { recipientId: userId },
      }),
    ]);

    return {
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("通知不存在");
    }

    if (notification.recipientId !== userId) {
      throw new Error("无权操作此通知");
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return {
      success: true,
      data: { notification: updatedNotification },
      message: "标记已读成功",
    };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: { read: true },
    });

    return {
      success: true,
      message: "全部标记已读成功",
    };
  }
}

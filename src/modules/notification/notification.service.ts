import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId: userId },
      include: {
        actor: true,
        post: true,
      },
    });
    return {
      success: true,
      data: { notifications },
    };
  }
}

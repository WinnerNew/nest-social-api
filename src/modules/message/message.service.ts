import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessages(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: {
          userId: userId,
        },
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
          chat: {
            include: {
              user1: {
                select: {
                  id: true,
                  username: true,
                  handle: true,
                  avatar: true,
                },
              },
              user2: {
                select: {
                  id: true,
                  username: true,
                  handle: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.message.count({
        where: { userId },
      }),
    ]);

    return {
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async createMessage(createMessageDto: CreateMessageDto, userId: string) {
    const { chatId, content } = createMessageDto;
    const message = await this.prisma.message.create({
      data: { content, userId, chatId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            handle: true,
            avatar: true,
          },
        },
        chat: {
          include: {
            user1: {
              select: {
                id: true,
                username: true,
                handle: true,
                avatar: true,
              },
            },
            user2: {
              select: {
                id: true,
                username: true,
                handle: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    return {
      success: true,
      data: { message },
      message: "发送消息成功",
    };
  }
}

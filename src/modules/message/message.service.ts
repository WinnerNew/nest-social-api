import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
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

  async getMessageById(id: string, userId: string) {
    const message = await this.prisma.message.findUnique({
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
    if (!message) {
      throw new NotFoundException("消息不存在");
    }
    if (message.userId !== userId) {
      throw new ForbiddenException("无权查看此消息");
    }
    return {
      success: true,
      data: { message },
    };
  }

  async deleteMessage(id: string, userId: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException("消息不存在");
    }
    if (message.userId !== userId) {
      throw new ForbiddenException("无权删除此消息");
    }
    await this.prisma.message.delete({ where: { id } });
    return {
      success: true,
      message: "消息已删除",
    };
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { PaginationUtil } from "../../common/utils/pagination.util";
import { ResponseUtil } from "../../common/utils/response.util";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  private getMessageInclude() {
    return {
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
    };
  }

  async getMessages(userId: string, page: number = 1, limit: number = 10) {
    const skip = PaginationUtil.calculateSkip(page, limit);
    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: this.getMessageInclude(),
      }),
      this.prisma.message.count({ where: { userId } }),
    ]);

    const pagination = PaginationUtil.calculatePagination(page, limit, total);
    return ResponseUtil.success({ messages, pagination });
  }

  async createMessage(createMessageDto: CreateMessageDto, userId: string) {
    const { chatId, content } = createMessageDto;
    const message = await this.prisma.message.create({
      data: { content, userId, chatId },
      include: this.getMessageInclude(),
    });
    return ResponseUtil.success({ message }, "发送消息成功");
  }

  async getMessageById(id: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: this.getMessageInclude(),
    });
    if (!message) {
      throw new NotFoundException("消息不存在");
    }
    if (message.userId !== userId) {
      throw new ForbiddenException("无权查看此消息");
    }
    return ResponseUtil.success({ message });
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
    return ResponseUtil.successWithMessage("消息已删除");
  }
}

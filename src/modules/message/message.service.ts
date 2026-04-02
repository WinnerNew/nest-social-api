import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessages(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        chat: true,
      },
    });
    return {
      success: true,
      data: { messages },
    };
  }

  async createMessage(createMessageDto: CreateMessageDto, userId: string) {
    const { chatId, content } = createMessageDto;
    const message = await this.prisma.message.create({
      data: { content, userId, chatId },
      include: {
        user: true,
        chat: true,
      },
    });
    return {
      success: true,
      data: { message },
      message: "发送消息成功",
    };
  }
}

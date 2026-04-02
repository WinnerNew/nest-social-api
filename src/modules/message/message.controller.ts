import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CreateMessageDto } from "./dto/create-message.dto";

@ApiTags("message")
@Controller("api/message")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMessages(@Request() req) {
    return this.messageService.getMessages(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    return this.messageService.createMessage(createMessageDto, req.user.id);
  }
}

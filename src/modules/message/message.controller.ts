import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CreateMessageDto } from "./dto/create-message.dto";

@ApiTags("message")
@Controller("api/message")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  async getMessages(
    @Request() req,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.messageService.getMessages(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
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

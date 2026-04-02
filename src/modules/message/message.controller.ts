import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
} from "@nestjs/swagger";
import { CreateMessageDto } from "./dto/create-message.dto";

@ApiTags("messages")
@Controller("messages")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "获取消息列表" })
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
  @ApiOperation({ summary: "发送消息" })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    return this.messageService.createMessage(createMessageDto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "获取指定消息" })
  async getMessageById(@Param("id") id: string, @Request() req) {
    return this.messageService.getMessageById(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "删除消息" })
  async deleteMessage(@Param("id") id: string, @Request() req) {
    return this.messageService.deleteMessage(id, req.user.id);
  }
}

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
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { CreateMessageDto } from "./dto/create-message.dto";

@ApiTags("messages")
@Controller("messages")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: "获取消息列表",
    description:
      "获取当前登录用户参与的聊天中的消息列表，按时间倒序排列，支持分页",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "页码，从1开始",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 10,
    description: "每页数量",
  })
  @ApiOkResponse({
    description: "获取消息列表成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            messages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "message-123" },
                  content: { type: "string", example: "你好！" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "user-123" },
                      username: { type: "string", example: "张三" },
                      handle: { type: "string", example: "@zhangsan" },
                      avatar: {
                        type: "string",
                        example: "https://example.com/avatar.jpg",
                      },
                    },
                  },
                  chat: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "chat-123" },
                    },
                  },
                },
              },
            },
            pagination: {
              type: "object",
              properties: {
                page: { type: "number", example: 1 },
                limit: { type: "number", example: 10 },
                total: { type: "number", example: 50 },
                totalPages: { type: "number", example: 5 },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "未提供有效的 JWT token",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Unauthorized" },
        error: { type: "string", example: "Unauthorized" },
      },
    },
  })
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
  @ApiOperation({
    summary: "发送消息",
    description: "在指定聊天中发送一条新消息",
  })
  @ApiCreatedResponse({
    description: "消息发送成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            message: {
              type: "object",
              properties: {
                id: { type: "string", example: "message-123" },
                content: { type: "string", example: "你好！" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "user-123" },
                    username: { type: "string", example: "张三" },
                    handle: { type: "string", example: "@zhangsan" },
                    avatar: {
                      type: "string",
                      example: "https://example.com/avatar.jpg",
                    },
                  },
                },
                chat: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "chat-123" },
                  },
                },
              },
            },
          },
        },
        message: { type: "string", example: "发送消息成功" },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "未提供有效的 JWT token",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Unauthorized" },
        error: { type: "string", example: "Unauthorized" },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "请求参数错误",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "string", example: "请求参数错误" },
        error: { type: "string", example: "Bad Request" },
      },
    },
  })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    return this.messageService.createMessage(createMessageDto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({
    summary: "获取指定消息",
    description: "根据消息 ID 获取指定消息的详细信息",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "消息 ID",
    example: "message-123",
  })
  @ApiOkResponse({
    description: "获取消息成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            message: {
              type: "object",
              properties: {
                id: { type: "string", example: "message-123" },
                content: { type: "string", example: "你好！" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "user-123" },
                    username: { type: "string", example: "张三" },
                    handle: { type: "string", example: "@zhangsan" },
                    avatar: {
                      type: "string",
                      example: "https://example.com/avatar.jpg",
                    },
                  },
                },
                chat: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "chat-123" },
                    user1: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "user-123" },
                        username: { type: "string", example: "张三" },
                        handle: { type: "string", example: "@zhangsan" },
                        avatar: {
                          type: "string",
                          example: "https://example.com/avatar.jpg",
                        },
                      },
                    },
                    user2: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "user-456" },
                        username: { type: "string", example: "李四" },
                        handle: { type: "string", example: "@lisi" },
                        avatar: {
                          type: "string",
                          example: "https://example.com/avatar2.jpg",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "未提供有效的 JWT token",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Unauthorized" },
        error: { type: "string", example: "Unauthorized" },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "无权查看此消息",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "无权查看此消息" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "消息不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "消息不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async getMessageById(@Param("id") id: string, @Request() req) {
    return this.messageService.getMessageById(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "删除消息",
    description: "删除自己发送的消息，只有消息发送者可以删除",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "消息 ID",
    example: "message-123",
  })
  @ApiNoContentResponse({
    description: "消息删除成功，无返回内容",
  })
  @ApiUnauthorizedResponse({
    description: "未提供有效的 JWT token",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Unauthorized" },
        error: { type: "string", example: "Unauthorized" },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "无权删除此消息",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "无权删除此消息" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "消息不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "消息不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async deleteMessage(@Param("id") id: string, @Request() req) {
    return this.messageService.deleteMessage(id, req.user.id);
  }
}

import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: "获取通知列表",
    description: "获取当前登录用户的通知列表，按时间倒序排列，支持分页",
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
    description: "获取通知列表成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            notifications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "notification-123" },
                  type: { type: "string", example: "like" },
                  read: { type: "boolean", example: false },
                  actor: {
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
                  post: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "post-123" },
                      content: { type: "string", example: "这是一条帖子内容" },
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
  async getNotifications(
    @Request() req,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.notificationService.getNotifications(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({
    summary: "获取指定通知",
    description: "根据通知 ID 获取指定通知的详细信息",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "通知 ID",
    example: "notification-123",
  })
  @ApiOkResponse({
    description: "获取通知成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            notification: {
              type: "object",
              properties: {
                id: { type: "string", example: "notification-123" },
                type: { type: "string", example: "like" },
                read: { type: "boolean", example: false },
                actor: {
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
                post: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "post-123" },
                    content: { type: "string", example: "这是一条帖子内容" },
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
    description: "无权查看此通知",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "无权查看此通知" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "通知不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "通知不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async getNotificationById(@Param("id") id: string, @Request() req) {
    return this.notificationService.getNotificationById(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id/read")
  @ApiOperation({
    summary: "标记通知为已读",
    description: "将指定通知标记为已读状态",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "通知 ID",
    example: "notification-123",
  })
  @ApiOkResponse({
    description: "标记已读成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            notification: {
              type: "object",
              properties: {
                id: { type: "string", example: "notification-123" },
                read: { type: "boolean", example: true },
              },
            },
          },
        },
        message: { type: "string", example: "标记已读成功" },
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
    description: "无权操作此通知",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "无权操作此通知" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "通知不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "通知不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async markAsRead(@Param("id") id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("read-all")
  @ApiOperation({
    summary: "标记所有通知为已读",
    description: "将当前用户的所有未读通知标记为已读",
  })
  @ApiOkResponse({
    description: "全部标记已读成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "全部标记已读成功" },
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
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "删除通知",
    description: "删除指定的通知，只有通知接收者可以删除",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "通知 ID",
    example: "notification-123",
  })
  @ApiNoContentResponse({
    description: "通知删除成功，无返回内容",
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
    description: "无权删除此通知",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "无权删除此通知" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "通知不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "通知不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async deleteNotification(@Param("id") id: string, @Request() req) {
    return this.notificationService.deleteNotification(id, req.user.id);
  }
}

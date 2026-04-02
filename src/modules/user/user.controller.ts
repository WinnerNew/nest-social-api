import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Request,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: "获取用户列表",
    description: "获取平台上所有用户的列表，支持分页",
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
    description: "获取用户列表成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: {
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
            },
            pagination: {
              type: "object",
              properties: {
                page: { type: "number", example: 1 },
                limit: { type: "number", example: 10 },
                total: { type: "number", example: 100 },
                totalPages: { type: "number", example: 10 },
              },
            },
          },
        },
      },
    },
  })
  async getUsers(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.userService.getUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiOperation({
    summary: "获取当前用户信息",
    description: "获取当前登录用户的详细信息",
  })
  @ApiOkResponse({
    description: "获取用户信息成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
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
  async getCurrentUser(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }

  @Get(":id")
  @ApiOperation({
    summary: "获取指定用户信息",
    description: "根据用户 ID 获取指定用户的详细信息",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "用户 ID",
    example: "user-123",
  })
  @ApiOkResponse({
    description: "获取用户信息成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
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
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "用户不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "用户不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("me")
  @ApiOperation({
    summary: "更新当前用户信息",
    description: "更新当前登录用户的信息，如用户名、头像等",
  })
  @ApiOkResponse({
    description: "更新用户信息成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
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
  @ApiBadRequestResponse({
    description: "更新参数错误",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "string", example: "请求参数错误" },
        error: { type: "string", example: "Bad Request" },
      },
    },
  })
  async updateCurrentUser(@Request() req, @Body() updateData: any) {
    return this.userService.updateUser(req.user.id, updateData);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete("me")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "删除当前用户",
    description: "永久删除当前登录的用户账户",
  })
  @ApiNoContentResponse({
    description: "用户删除成功，无返回内容",
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
  async deleteCurrentUser(@Request() req) {
    return this.userService.deleteUser(req.user.id);
  }
}

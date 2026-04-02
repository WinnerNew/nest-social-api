import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { PostService } from "./post.service";
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
import { CreatePostDto } from "./dto/create-post.dto";

@ApiTags("posts")
@Controller("posts")
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiOperation({
    summary: "获取帖子列表",
    description: "获取平台上所有帖子的列表，按创建时间倒序排列，支持分页",
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
    description: "获取帖子列表成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "post-123" },
                  content: { type: "string", example: "这是一条帖子内容" },
                  image: {
                    type: "string",
                    example: "https://example.com/image.jpg",
                  },
                  likesCount: { type: "number", example: 10 },
                  repostsCount: { type: "number", example: 2 },
                  repliesCount: { type: "number", example: 5 },
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
  async getPosts(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.postService.getPosts(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: "创建帖子",
    description: "创建一条新帖子，需要提供内容和可选的图片",
  })
  @ApiCreatedResponse({
    description: "帖子创建成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            post: {
              type: "object",
              properties: {
                id: { type: "string", example: "post-123" },
                content: { type: "string", example: "这是一条帖子内容" },
                image: {
                  type: "string",
                  example: "https://example.com/image.jpg",
                },
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
        message: { type: "string", example: "创建帖子成功" },
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
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createPost(createPostDto, req.user.id);
  }

  @Get(":id")
  @ApiOperation({
    summary: "获取指定帖子",
    description:
      "根据帖子 ID 获取指定帖子的详细信息，包括点赞数、转发数和回复数",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "帖子 ID",
    example: "post-123",
  })
  @ApiOkResponse({
    description: "获取帖子成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            post: {
              type: "object",
              properties: {
                id: { type: "string", example: "post-123" },
                content: { type: "string", example: "这是一条帖子内容" },
                image: {
                  type: "string",
                  example: "https://example.com/image.jpg",
                },
                likesCount: { type: "number", example: 10 },
                repostsCount: { type: "number", example: 2 },
                repliesCount: { type: "number", example: 5 },
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
      },
    },
  })
  @ApiNotFoundResponse({
    description: "帖子不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "帖子不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async getPostById(@Param("id") id: string) {
    return this.postService.getPostById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({
    summary: "更新帖子",
    description: "更新自己创建的帖子内容，只有帖子作者可以更新",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "帖子 ID",
    example: "post-123",
  })
  @ApiOkResponse({
    description: "帖子更新成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            post: {
              type: "object",
              properties: {
                id: { type: "string", example: "post-123" },
                content: { type: "string", example: "更新后的帖子内容" },
                image: {
                  type: "string",
                  example: "https://example.com/new-image.jpg",
                },
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
        message: { type: "string", example: "帖子更新成功" },
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
    description: "无权修改此帖子",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "无权修改此帖子" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "帖子不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "帖子不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async updatePost(
    @Param("id") id: string,
    @Body() updateData: CreatePostDto,
    @Request() req
  ) {
    return this.postService.updatePost(id, updateData, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "删除帖子",
    description: "删除自己创建的帖子，只有帖子作者可以删除",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "帖子 ID",
    example: "post-123",
  })
  @ApiNoContentResponse({
    description: "帖子删除成功，无返回内容",
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
    description: "无权删除此帖子",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "无权删除此帖子" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "帖子不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "帖子不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async deletePost(@Param("id") id: string, @Request() req) {
    return this.postService.deletePost(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  @ApiOperation({
    summary: "点赞帖子",
    description: "为指定帖子点赞，每个用户只能点赞一次",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "帖子 ID",
    example: "post-123",
  })
  @ApiOkResponse({
    description: "点赞成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "点赞成功" },
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
    description: "已经点赞过此帖子",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "已经点赞过此帖子" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "帖子不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "帖子不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async likePost(@Param("id") id: string, @Request() req) {
    return this.postService.likePost(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id/like")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "取消点赞",
    description: "取消对指定帖子的点赞",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "帖子 ID",
    example: "post-123",
  })
  @ApiNoContentResponse({
    description: "取消点赞成功，无返回内容",
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
  @ApiNotFoundResponse({
    description: "未点赞此帖子或帖子不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "未点赞此帖子" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async unlikePost(@Param("id") id: string, @Request() req) {
    return this.postService.unlikePost(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/repost")
  @ApiOperation({
    summary: "转发帖子",
    description: "转发指定帖子，每个用户只能转发一次",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "帖子 ID",
    example: "post-123",
  })
  @ApiOkResponse({
    description: "转发成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "转发成功" },
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
    description: "已经转发过此帖子",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "已经转发过此帖子" },
        error: { type: "string", example: "Forbidden" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "帖子不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "帖子不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async repostPost(@Param("id") id: string, @Request() req) {
    return this.postService.repostPost(id, req.user.id);
  }
}

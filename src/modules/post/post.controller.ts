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
} from "@nestjs/swagger";
import { CreatePostDto } from "./dto/create-post.dto";

@ApiTags("posts")
@Controller("posts")
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiOperation({ summary: "获取帖子列表" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  async getPosts(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.postService.getPosts(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "创建帖子" })
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createPost(createPostDto, req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "获取指定帖子" })
  async getPostById(@Param("id") id: string) {
    return this.postService.getPostById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({ summary: "更新帖子" })
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
  @ApiOperation({ summary: "删除帖子" })
  async deletePost(@Param("id") id: string, @Request() req) {
    return this.postService.deletePost(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  @ApiOperation({ summary: "点赞帖子" })
  async likePost(@Param("id") id: string, @Request() req) {
    return this.postService.likePost(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id/like")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "取消点赞" })
  async unlikePost(@Param("id") id: string, @Request() req) {
    return this.postService.unlikePost(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/repost")
  @ApiOperation({ summary: "转发帖子" })
  async repostPost(@Param("id") id: string, @Request() req) {
    return this.postService.repostPost(id, req.user.id);
  }
}

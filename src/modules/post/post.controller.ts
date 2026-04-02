import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CreatePostDto } from "./dto/create-post.dto";

@ApiTags("post")
@Controller("api/post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
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
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createPost(createPostDto, req.user.id);
  }
}

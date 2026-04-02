import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CreatePostDto } from "./dto/create-post.dto";

@ApiTags("post")
@Controller("api/post")
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getPosts() {
    return this.postService.getPosts();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.createPost(createPostDto, req.user.id);
  }
}

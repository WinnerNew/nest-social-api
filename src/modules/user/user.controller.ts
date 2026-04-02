import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

@ApiTags("user")
@Controller("api/user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  async getUsers(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.userService.getUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getCurrentUser(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }
}

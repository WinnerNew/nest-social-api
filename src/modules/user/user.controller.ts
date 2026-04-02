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
} from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "获取用户列表" })
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
  @ApiOperation({ summary: "获取当前用户信息" })
  async getCurrentUser(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "获取指定用户信息" })
  async getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("me")
  @ApiOperation({ summary: "更新当前用户信息" })
  async updateCurrentUser(@Request() req, @Body() updateData: any) {
    return this.userService.updateUser(req.user.id, updateData);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete("me")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "删除当前用户" })
  async deleteCurrentUser(@Request() req) {
    return this.userService.deleteUser(req.user.id);
  }
}

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
} from "@nestjs/swagger";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "获取通知列表" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
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
  @ApiOperation({ summary: "获取指定通知" })
  async getNotificationById(@Param("id") id: string, @Request() req) {
    return this.notificationService.getNotificationById(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id/read")
  @ApiOperation({ summary: "标记通知为已读" })
  async markAsRead(@Param("id") id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("read-all")
  @ApiOperation({ summary: "标记所有通知为已读" })
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "删除通知" })
  async deleteNotification(@Param("id") id: string, @Request() req) {
    return this.notificationService.deleteNotification(id, req.user.id);
  }
}

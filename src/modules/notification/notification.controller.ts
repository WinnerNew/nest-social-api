import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

@ApiTags("notification")
@Controller("api/notification")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
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
  @Patch(":id/read")
  async markAsRead(@Param("id") id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("read-all")
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}

import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("notification")
@Controller("api/notification")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(@Request() req) {
    return this.notificationService.getNotifications(req.user.id);
  }
}

import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("app")
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: "获取 API 信息" })
  @ApiResponse({ status: 200, description: "成功返回 API 信息" })
  getApiInfo() {
    return {
      name: "Social Media API",
      version: "1.0.0",
      description: "社交媒体应用程序的后端 API",
      endpoints: {
        auth: "/api/auth",
        user: "/api/user",
        post: "/api/post",
        message: "/api/message",
        notification: "/api/notification",
      },
      documentation: "/api/docs",
    };
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "用户注册",
    description: "创建一个新的用户账户，需要提供用户名、handle、密码和头像",
  })
  @ApiCreatedResponse({
    description: "用户注册成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
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
        message: { type: "string", example: "注册成功" },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "请求参数错误或 handle 已存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "string", example: "Handle 已存在" },
        error: { type: "string", example: "Bad Request" },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "用户登录",
    description: "使用 handle 和密码登录，返回 JWT 访问令牌",
  })
  @ApiOkResponse({
    description: "登录成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
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
        message: { type: "string", example: "登录成功" },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "handle 或密码错误",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "用户名或密码错误" },
        error: { type: "string", example: "Unauthorized" },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiOperation({
    summary: "获取当前用户信息",
    description:
      "获取当前登录用户的详细信息，需要在请求头中携带有效的 JWT token",
  })
  @ApiOkResponse({
    description: "获取用户信息成功",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
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
    description: "用户不存在",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "用户不存在" },
        error: { type: "string", example: "Not Found" },
      },
    },
  })
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.id);
  }
}

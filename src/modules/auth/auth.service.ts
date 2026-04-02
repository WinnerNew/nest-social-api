import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../common/utils/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const { username, handle, password, avatar } = registerDto;

    // 检查用户名是否已存在
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      throw new ConflictException("用户名已存在");
    }

    // 检查 handle 是否已存在
    const existingUserByHandle = await this.prisma.user.findUnique({
      where: { handle },
    });
    if (existingUserByHandle) {
      throw new ConflictException("Handle已存在");
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: { username, handle, password: hashedPassword, avatar },
    });

    // 生成 JWT 令牌
    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: "1h" }
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          handle: user.handle,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "注册成功",
    };
  }

  async login(loginDto: LoginDto) {
    const { handle, password } = loginDto;

    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { handle },
    });
    if (!user) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    // 生成 JWT 令牌
    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: "1h" }
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          handle: user.handle,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "登录成功",
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("用户不存在");
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          handle: user.handle,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    };
  }
}

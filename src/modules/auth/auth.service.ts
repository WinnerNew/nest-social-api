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
import { ResponseUtil } from "../../common/utils/response.util";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      username: user.username,
      handle: user.handle,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }

  async register(registerDto: RegisterDto) {
    const { username, handle, password, avatar } = registerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { handle }] },
    });
    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException("用户名已存在");
      }
      if (existingUser.handle === handle) {
        throw new ConflictException("Handle已存在");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, handle, password: hashedPassword, avatar },
    });
    const token = this.jwtService.sign({ userId: user.id });

    return ResponseUtil.success(
      { user: this.sanitizeUser(user), token },
      "注册成功"
    );
  }

  async login(loginDto: LoginDto) {
    const { handle, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { handle } });
    if (!user) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("用户名或密码错误");
    }

    const token = this.jwtService.sign({ userId: user.id });
    return ResponseUtil.success(
      { user: this.sanitizeUser(user), token },
      "登录成功"
    );
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("用户不存在");
    }
    return ResponseUtil.success({ user: this.sanitizeUser(user) });
  }
}

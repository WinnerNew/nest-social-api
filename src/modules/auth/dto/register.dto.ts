import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ description: "用户名" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "Handle (如 @username)" })
  @IsString()
  @IsNotEmpty()
  handle: string;

  @ApiProperty({ description: "密码" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: "头像 URL" })
  @IsString()
  @IsNotEmpty()
  avatar: string;
}

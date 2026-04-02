import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Handle (如 @username)" })
  @IsString()
  @IsNotEmpty()
  handle: string;

  @ApiProperty({ description: "密码" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

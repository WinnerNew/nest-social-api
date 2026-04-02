import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
  @ApiProperty({ description: "聊天 ID" })
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty({ description: "消息内容" })
  @IsString()
  @IsNotEmpty()
  content: string;
}

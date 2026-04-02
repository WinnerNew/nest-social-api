import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({ description: "帖子内容" })
  @IsString()
  content: string;

  @ApiProperty({ description: "帖子图片 URL", required: false })
  @IsString()
  @IsOptional()
  image?: string;
}

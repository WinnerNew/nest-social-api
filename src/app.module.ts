import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { PostModule } from "./modules/post/post.module";
import { MessageModule } from "./modules/message/message.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { PrismaModule } from "./common/utils/prisma.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    MessageModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

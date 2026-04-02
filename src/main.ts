import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局前缀
  app.setGlobalPrefix("api");

  // 配置 CORS
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // 配置验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle("Social Media API")
    .setDescription("API documentation for social media application")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api/docs`
  );
}
bootstrap();

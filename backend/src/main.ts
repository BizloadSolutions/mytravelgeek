import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix("api");

  const port = Number(process.env.NEST_PORT ?? 3001);
  const host = process.env.NEST_HOST ?? "127.0.0.1";
  await app.listen(port, host);
}

void bootstrap();

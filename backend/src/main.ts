import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // ← acepta lista separada por comas
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return cb(null, true);
      return cb(null, origins.includes(origin));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 🔒 Swagger solo en dev o si SWAGGER_ENABLE=true
  const enableSwagger =
    process.env.SWAGGER_ENABLE === 'true' ||
    process.env.NODE_ENV !== 'production';

  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('SaaS Surveys API')
      .setDescription('API docs para encuestas, respuestas y analytics')
      .setVersion('1.0.0')
      .addServer('/api')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Opcional: exportar OpenAPI JSON
    app
      .getHttpAdapter()
      .get('/api/openapi.json', (_req, res) => res.json(document));

    logger.log('Swagger habilitado en /api/docs');
  } else {
    logger.log(
      'Swagger deshabilitado (entorno producción sin SWAGGER_ENABLE=true)',
    );
  }

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();

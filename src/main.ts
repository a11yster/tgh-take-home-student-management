import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AppException } from './common/exceptions/app.exception';
import { ErrorCode } from './common/exceptions/error-code.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors) =>
        new AppException(
          HttpStatus.BAD_REQUEST,
          'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          validationErrors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
          })),
        ),
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Student Management API')
    .setDescription('Admin and student APIs with JWT auth, RBAC, and task management')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api/json',
  });

  app.use(
    '/api-reference',
    apiReference({
      theme: 'deepSpace',
      spec: {
        content: document,
      },
      metaData: {
        title: 'student-management-api-reference',
      },
    }),
  );

  const port = Number(process.env.PORT || 8080);
  await app.listen(port);
  logger.log(`Server listening on port ${port}`);
  logger.log(`Scalar docs available at /api-reference`);
  logger.log(`Swagger docs available at /api`);

  let isShuttingDown = false;
  const shutdownSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

  const gracefulShutdown = async (signal: NodeJS.Signals) => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    logger.warn(`Received ${signal}, starting graceful shutdown`);

    try {
      await app.close();
      logger.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Graceful shutdown failed', error as Error);
      process.exit(1);
    }
  };

  shutdownSignals.forEach((signal) => {
    process.once(signal, () => {
      void gracefulShutdown(signal);
    });
  });
}

bootstrap();

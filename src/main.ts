import { HttpStatus, ValidationPipe } from '@nestjs/common';
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

  app.enableCors();
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
  SwaggerModule.setup('api', app, document);

  app.use(
    '/api-reference',
    apiReference({
      theme: 'mars',
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
}

bootstrap();

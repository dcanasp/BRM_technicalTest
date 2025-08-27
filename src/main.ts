import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Enter JWT token',
            in: 'header'
          },
          'access-token' // This is a unique name for this security scheme
        )

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Esto remueve propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Esto lanza un error si hay propiedades extras
    transform: true, // Esto convierte los payloads a instancias de DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

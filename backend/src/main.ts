import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser para leer refresh token en cookies
  app.use(cookieParser());
  app.use(morgan('combined')); // <-- aquí: logs por request
  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Consorcio API')
    .setDescription(
      'API completa para la gestión del consorcio con usuarios y productos',
    )
    .setVersion('1.0.0')
    .addTag('users', 'Operaciones relacionadas con usuarios')
    .addTag('products', 'Operaciones relacionadas con productos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:4000', 'Servidor de desarrollo')
    .setContact(
      'Equipo de desarrollo',
      'https://consorcio.com',
      'dev@consorcio.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    },
    customSiteTitle: 'Consorcio API Docs',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
    `,
  });

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Servidor ejecutándose en: http://localhost:${port}`);
  console.log(
    `📚 Documentación Swagger disponible en: http://localhost:${port}/api/docs`,
  );
  console.log(`🔗 API base URL: http://localhost:${port}/api`);
}
bootstrap();

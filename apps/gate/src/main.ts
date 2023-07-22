import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '../../../libs/rmq/src';
import { GATE_QUEUE } from '../../../libs/common/src/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessages = errors?.map((error) =>
          Object.values(error?.constraints),
        );
        return new BadRequestException(errorMessages?.toString());
      },
    }),
  );

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(GATE_QUEUE));
  await app.startAllMicroservices();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('GATE_PORT');
  console.log('🚀 ~ file: main.ts:40 ~ bootstrap ~ port:', port);

  await app.listen(port, () => logger.log(`🚀 GATE is running on :${port}`));
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { RmqService } from '../../../libs/rmq/src';
import { TASK_QUEUE } from '../../../libs/common/src/constants';
import { RpcException } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableShutdownHooks();

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
        return new RpcException(errorMessages?.toString());
      },
    }),
  );

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(TASK_QUEUE));
  await app.startAllMicroservices();

  logger.log('🚀 TASK app is running');
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RmqModule } from '../../../libs/rmq/src';
import { CommonModule } from '../../../libs/common/src';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { LoggerModule } from 'nestjs-pino';
import { TASK_QUEUE } from '../../../libs/common/src/constants';
import { APP_FILTER } from '@nestjs/core';
import { GateExceptionsFilter } from './gate.exception-filter';

@Module({
  imports: [
    RmqModule,
    CommonModule,
    RmqModule.register({ name: TASK_QUEUE }),
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = config.get<string>('NODE_ENV');
        const level = env === 'production' ? 'info' : 'debug';
        const transport =
          env === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined;
        return {
          pinoHttp: {
            level,
            transport,
            base: undefined,
            name: 'GATE',
            redact: ['req.headers.authorization'],
            formatters: { level: (label: string) => ({ level: label }) },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GateExceptionsFilter,
    },
  ],
})
export class AppModule {}

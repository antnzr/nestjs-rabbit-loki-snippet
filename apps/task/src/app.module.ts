import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RmqModule } from '../../../libs/rmq/src';
import { CommonModule } from '../../../libs/common/src';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { LoggerModule } from 'nestjs-pino';
import { GATE_QUEUE } from '../../../libs/common/src/constants';

@Module({
  imports: [
    RmqModule,
    CommonModule,
    RmqModule.register({ name: GATE_QUEUE }),
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
            name: 'TASK',
            redact: ['req.headers.authorization'],
            formatters: { level: (label: string) => ({ level: label }) },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

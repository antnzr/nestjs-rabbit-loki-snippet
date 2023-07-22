import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  DEFAULT_TIMEOUT,
  TASK,
  TASK_QUEUE,
} from '../../../libs/common/src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import { GreetingDto } from '../../../libs/common/src/dto';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(@Inject(TASK_QUEUE) private readonly taskService: ClientProxy) {}

  async greeting(): Promise<string> {
    this.logger.log(`greeting to task queue`);
    return this.getGreeting();
  }

  private async getGreeting(): Promise<string> {
    return lastValueFrom(
      this.taskService
        .send(TASK.GREETING, this.getGreetingPayload())
        .pipe(timeout(DEFAULT_TIMEOUT))
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new BadRequestException(
                  `Failed to get greeting. Error: ${error.message}`,
                ),
            ),
          ),
        ),
    );
  }

  private getGreetingPayload(): GreetingDto {
    return { timestampt: new Date().toISOString() };
  }
}

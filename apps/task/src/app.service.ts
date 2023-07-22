import { Injectable, Logger } from '@nestjs/common';
import { GreetingDto } from '../../../libs/common/src/dto';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  handleGreeting(payload: GreetingDto): string {
    const { timestampt } = payload;
    this.logger.log(`Handle greeting at: ${timestampt}`);
    return `Hello. Timestamp: ${this.cleanupTimestamp(timestampt)}`;
  }

  private cleanupTimestamp(timestamp: string): string {
    return timestamp.replace('T', ' ').slice(0, 19);
  }
}

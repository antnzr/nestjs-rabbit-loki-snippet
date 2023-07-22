import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Some data' })
  data?: any;
}

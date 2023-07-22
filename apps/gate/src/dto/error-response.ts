import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ description: 'Error message', example: 'Ooops!' })
  error: string;

  @ApiProperty({ description: 'Status code', example: HttpStatus.BAD_REQUEST })
  status: number;

  @ApiProperty({ description: 'Url path', example: '/api/v1' })
  path: string;

  @ApiProperty({ description: 'Timestamp', example: new Date().toISOString() })
  timestamp: string;
}

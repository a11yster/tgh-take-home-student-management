import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ApiErrorDto {
  @ApiProperty({ example: 'BAD_REQUEST' })
  code: string;

  @ApiPropertyOptional({ example: { field: 'email', error: 'must be an email' } })
  details?: unknown;
}

export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'success' })
  message: string;

  @ApiPropertyOptional({ nullable: true })
  data?: T | null;

  @ApiPropertyOptional({ type: ApiErrorDto })
  error?: ApiErrorDto;
}

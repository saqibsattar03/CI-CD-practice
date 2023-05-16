import { IsOptional, IsPositive } from 'class-validator';

export class PagonationQueryDto {
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}

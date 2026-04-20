import { IsOptional, IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryHistoryDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  status?: string; // Filter by SUCCESS | CLIENT_ERROR | SERVER_ERROR

  @IsOptional()
  @IsString()
  method?: string; // Filter by GET | POST | ...
}

import {
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ApiCallEventDto {
  @IsString()
  method: string;

  @IsString()
  url: string;

  @IsOptional()
  requestHeaders?: Record<string, string>;

  @IsOptional()
  requestBody?: unknown;

  @IsOptional()
  queryParams?: Record<string, string>;

  @IsOptional()
  @IsInt()
  statusCode?: number;

  @IsOptional()
  @IsString()
  statusText?: string;

  @IsOptional()
  responseHeaders?: Record<string, string>;

  @IsOptional()
  responseBody?: unknown;

  @IsOptional()
  @IsInt()
  responseSize?: number;

  @IsInt()
  latency: number; // ms

  @IsDateString()
  startedAt: string;

  @IsDateString()
  endedAt: string;
}

export class IngestDto {
  @IsString()
  sdkToken: string;

  @IsString()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiCallEventDto)
  events: ApiCallEventDto[];
}

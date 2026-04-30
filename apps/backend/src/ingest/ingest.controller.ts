import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestDto } from './dto/ingest.dto';

/**
 * POST /ingest
 *
 * This endpoint is called by the CLI agent (NOT the dashboard user).
 * Authentication is done via sdkToken inside the request body.
 * No JWT required — the SDK token acts as the credential.
 */
@Controller('ingest')
export class IngestController {
  constructor(private ingestService: IngestService) {}

  /**
   * POST /ingest/setup
   * Called by `api-nest init` — validates SDK token and auto-creates/returns
   * a project for the given project name. Returns { projectId, projectName }.
   */
  @Post('setup')
  @HttpCode(HttpStatus.OK)
  setup(@Body() body: { sdkToken: string; projectName: string }) {
    return this.ingestService.setup(body.sdkToken, body.projectName);
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  ingest(@Body() dto: IngestDto) {
    return this.ingestService.ingest(dto);
  }
}

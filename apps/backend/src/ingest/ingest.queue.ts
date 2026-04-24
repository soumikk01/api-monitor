import { ApiCallEventDto } from './dto/ingest.dto';

/** BullMQ queue name — used by both producer (IngestService) and processor */
export const INGEST_QUEUE = 'ingest';

/** Job names within the ingest queue */
export const INGEST_JOB = {
  PROCESS_BATCH: 'process-batch',
} as const;

/** Shape of the job payload pushed onto the queue */
export interface IngestJobPayload {
  projectId: string;
  userId: string;
  events: ApiCallEventDto[];
}

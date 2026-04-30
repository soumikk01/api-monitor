import * as https from 'https';
import { getQueue } from './queue';
import { loadConfig } from '../config';

let started = false;

/**
 * Polls the event queue every `interval` ms.
 * Drains the queue and POSTs the batch to the backend /ingest endpoint.
 */
export function startSender(interval = 500) {
  if (started) return;
  started = true;

  setInterval(() => {
    const config = loadConfig();
    if (!config) return;

    const queue = getQueue();
    const batch = queue.splice(0, queue.length);
    if (!batch.length) return;

    const payload = JSON.stringify({
      sdkToken: config.sdkToken,
      projectId: config.projectId ?? '',
      events: batch,
    });

    const backendUrl = new URL('/api/v1/ingest', config.backendUrl);
    const options: https.RequestOptions = {
      hostname: backendUrl.hostname,
      port: backendUrl.port || (backendUrl.protocol === 'https:' ? 443 : 80),
      path: backendUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const protocol =
      backendUrl.protocol === 'https:'
        ? https
        : (require('http') as typeof https);

    const req = protocol.request(options, (res) => {
      // Consume response to free socket
      res.resume();
    });

    req.on('error', (err) => {
      console.error('[apio] Failed to send batch:', err.message);
      // Put events back into queue so they aren't lost
      getQueue().unshift(...batch);
    });

    req.write(payload);
    req.end();
  }, interval);
}

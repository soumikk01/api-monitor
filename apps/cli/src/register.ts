/**
 * register.ts — Activated at the top of the user's app entry point.
 *
 * Patches THREE layers of HTTP traffic:
 *  1. Incoming requests to the user's Express/Fastify/Koa server
 *  2. Outgoing fetch() calls made by the server
 *  3. Outgoing axios calls made by the server
 */
import { patchIncomingRequests } from './interceptor/incoming';
import { patchAxios } from './interceptor/axios';
import { patchFetch } from './interceptor/fetch';

// Must run BEFORE any http.createServer() call — import hoisting ensures this
patchIncomingRequests();
patchAxios();
patchFetch();

console.log('[apio] 🟢 Monitoring active — incoming + outgoing HTTP captured');

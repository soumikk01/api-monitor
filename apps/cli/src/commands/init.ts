import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import { saveConfig } from '../config';

interface InitOptions {
  token: string;
  project?: string;
  backend: string;
}

/** Simple HTTP POST — no axios dependency during init */
function post<T>(url: string, body: object): Promise<T> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = JSON.stringify(body);
    const mod = parsed.protocol === 'https:' ? https : http;
    const req = mod.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk: string) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data) as T;
            if ((res.statusCode ?? 0) >= 400) {
              reject(new Error((json as { message?: string }).message ?? `HTTP ${res.statusCode}`));
            } else {
              resolve(json);
            }
          } catch {
            reject(new Error('Invalid JSON from backend'));
          }
        });
      },
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

export async function initCommand(options: InitOptions) {
  console.log('\n🔍 Apio — Initializing...\n');

  const cwd = process.cwd();

  // Derive project name from directory name (or use provided --project)
  const dirName = path.basename(cwd);
  const projectName = options.project ?? dirName;

  // Contact backend to validate token and auto-create/find the project
  const setupUrl = `${options.backend}/api/v1/ingest/setup`;
  console.log(`📡 Connecting to backend: ${options.backend}`);

  let projectId: string;
  try {
    const result = await post<{ projectId: string; projectName: string }>(setupUrl, {
      sdkToken: options.token,
      projectName,
    });
    projectId = result.projectId;
    console.log(`✅ Project ready: "${result.projectName}" (id: ${projectId})`);
  } catch (err) {
    console.error(`\n❌ Failed to connect to Apio backend at ${options.backend}`);
    console.error(`   Error: ${(err as Error).message}`);
    console.error(`   Make sure the backend is running and try again.\n`);
    process.exit(1);
  }

  // Save config with the resolved projectId
  const configPath = saveConfig({
    sdkToken: options.token,
    projectId,
    backendUrl: options.backend,
  });

  console.log(`✅ Config saved to: ${configPath}`);

  // Inject require hook into the project's entry file
  injectRegisterHook(cwd);

  console.log('\n🎉 Apio is active!');
  console.log(`   Every HTTP call from your dev server will stream to the dashboard.`);
  console.log(`   Dashboard: ${options.backend.replace(':4000', ':3000')}/dashboard\n`);
}

/**
 * Detects if the project uses ES modules ("type": "module" in package.json).
 * Checks the given dir AND any subdir package.json files.
 */
function isEsmProject(dir: string): boolean {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return false;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { type?: string };
    return pkg.type === 'module';
  } catch { return false; }
}

/**
 * Parses package.json scripts to find server subdirectories.
 * e.g. "server": "cd backend && npm run dev" → returns ['backend']
 */
function detectServerDirs(cwd: string): string[] {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) return [];
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      scripts?: Record<string, string>;
    };
    const dirs: string[] = [];
    for (const script of Object.values(pkg.scripts ?? {})) {
      // Match: "cd <subdir>" patterns
      const match = /\bcd\s+([\w\-.]+)/.exec(script);
      if (match) dirs.push(match[1]);
    }
    return [...new Set(dirs)];
  } catch { return []; }
}

/**
 * Detects which package manager the project uses by checking lockfiles.
 * Returns: 'bun' | 'yarn' | 'pnpm' | 'npm'
 */
function detectPackageManager(cwd: string): 'bun' | 'yarn' | 'pnpm' | 'npm' {
  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) return 'bun';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  return 'npm';
}

/**
 * Recursively finds entry files up to maxDepth levels.
 * Looks for files named index/server/app with .js/.ts extension
 * that contain server framework keywords.
 */
function findEntryRecursive(dir: string, depth = 0, maxDepth = 3): string | null {
  if (depth > maxDepth || !fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Check files in this dir first
  const fileNames = ['index.js', 'server.js', 'app.js', 'index.ts', 'server.ts', 'app.ts', 'main.ts', 'main.js'];
  for (const name of fileNames) {
    const full = path.join(dir, name);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf-8');
      // Must look like a server entry (has express/fastify/http.listen etc.)
      if (/express|fastify|app\.listen|createServer|NestFactory/.test(content)) {
        return full;
      }
    }
  }

  // Skip node_modules and hidden dirs
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name === 'node_modules' || e.name.startsWith('.') || e.name === 'dist') continue;
    const found = findEntryRecursive(path.join(dir, e.name), depth + 1, maxDepth);
    if (found) return found;
  }
  return null;
}

// Node.js flags
const NODE_FLAG_ESM = '--import apio-cli/dist/register.js';
const NODE_FLAG_CJS = '--require apio-cli/dist/register';
// Bun preload flag (bun uses --preload instead of --import/--require)
const BUN_FLAG = '--preload apio-cli/dist/register.js';
const ALREADY_MARKER = 'apio-cli';

/**
 * Patches the `node` command inside package.json scripts so that the
 * apio interceptor is loaded automatically on every server start —
 * WITHOUT touching any source files.
 *
 * Strategy:
 *  1. Find the package.json that owns the actual node server scripts
 *     (searches cwd + any "cd <subdir>" dirs found in monorepo root scripts).
 *  2. For each script that invokes `node` directly, prepend --import (ESM)
 *     or --require (CJS) flag so monitoring loads before user code.
 *  3. Falls back to ts-node / nodemon variants.
 */
function injectRegisterHook(cwd: string) {
  // Collect all directories that might have a package.json with node scripts
  const serverDirs = detectServerDirs(cwd);
  const searchRoots = [cwd, ...serverDirs.map(d => path.join(cwd, d))];

  for (const root of searchRoots) {
    const pkgPath = path.join(root, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;

    let pkg: { type?: string; scripts?: Record<string, string> };
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as typeof pkg;
    } catch { continue; }

    if (!pkg.scripts || Object.keys(pkg.scripts).length === 0) continue;

    const pm   = detectPackageManager(root);
    const isBun = pm === 'bun';
    const esm  = pkg.type === 'module';

    // Bun uses --preload; Node.js uses --import (ESM) or --require (CJS)
    const flag = isBun ? BUN_FLAG : (esm ? NODE_FLAG_ESM : NODE_FLAG_CJS);
    // The runtime keyword to patch in the script
    const runtimeRx = isBun ? /\bbun\b/ : /\bnode\b/;
    const runtimeWord = isBun ? 'bun' : 'node';

    // Keys we consider as "server start" scripts
    const scriptKeys = ['dev', 'start', 'serve', 'server', 'start:dev', 'start:prod'];
    let patched = false;

    for (const key of scriptKeys) {
      const original = pkg.scripts[key];
      if (!original) continue;

      // Skip if already patched
      if (original.includes(ALREADY_MARKER)) {
        console.log(`ℹ️  Monitor hook already in ${path.relative(cwd, pkgPath)} → ${key}`);
        return;
      }

      // Only patch scripts that directly invoke the runtime (not cd/concurrently wrappers)
      if (runtimeRx.test(original) && !/\bcd\b/.test(original)) {
        pkg.scripts[key] = original.replace(runtimeRx, `${runtimeWord} ${flag}`);
        console.log(`✅ Patched script "${key}" in ${path.relative(cwd, pkgPath)} (${pm})`);
        patched = true;
      }
    }

    if (patched) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
      console.log(`✅ Saved: ${path.relative(cwd, pkgPath)}`);
      return;
    }
  }

  // Fallback: couldn't patch automatically
  const pm = detectPackageManager(cwd);
  console.log('\n⚠️  Could not auto-patch your start script.');
  console.log('   Add the appropriate flag to your start command in package.json:');
  if (pm === 'bun') {
    console.log(`   Bun:   bun ${BUN_FLAG} src/index.ts`);
  } else {
    console.log(`   ESM:   node ${NODE_FLAG_ESM} src/index.js`);
    console.log(`   CJS:   node ${NODE_FLAG_CJS} src/index.js`);
  }
  console.log('');
}

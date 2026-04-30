import * as fs from 'fs';
import * as path from 'path';

export interface CliConfig {
  sdkToken: string;
  projectId?: string;
  backendUrl: string;
}

const CONFIG_FILE = '.api-nest.json';

export function saveConfig(config: CliConfig, cwd = process.cwd()) {
  const filePath = path.join(cwd, CONFIG_FILE);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
  return filePath;
}

/**
 * Loads config by walking UP the directory tree from startDir.
 * Env vars are merged on top with highest priority so Docker users
 * don't need to modify .api-nest.json inside the image:
 *
 *   APINEST_BACKEND_URL  — e.g. http://host.docker.internal:4000
 *   APINEST_SDK_TOKEN    — overrides token from file
 *   APINEST_PROJECT_ID   — overrides projectId from file
 */
export function loadConfig(startDir = process.cwd()): CliConfig | null {
  // Walk up directories to find the config file
  let fileConfig: CliConfig | null = null;
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    const filePath = path.join(dir, CONFIG_FILE);
    if (fs.existsSync(filePath)) {
      try {
        fileConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CliConfig;
      } catch { /* ignore */ }
      break;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // Env var overrides (highest priority — critical for Docker / CI)
  const envBackend = process.env.APINEST_BACKEND_URL;
  const envToken   = process.env.APINEST_SDK_TOKEN;
  const envProject = process.env.APINEST_PROJECT_ID;

  // If all three are set via env, no file needed (pure env-var mode)
  if (!fileConfig && envToken && envBackend) {
    return {
      sdkToken:   envToken,
      projectId:  envProject,
      backendUrl: envBackend,
    };
  }

  if (!fileConfig) return null;

  // Merge env overrides on top of file config
  return {
    ...fileConfig,
    ...(envToken   ? { sdkToken:  envToken   } : {}),
    ...(envProject ? { projectId: envProject  } : {}),
    ...(envBackend ? { backendUrl: envBackend } : {}),
  };
}

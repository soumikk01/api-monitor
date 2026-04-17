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

export function loadConfig(cwd = process.cwd()): CliConfig | null {
  const filePath = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as CliConfig;
  } catch {
    return null;
  }
}

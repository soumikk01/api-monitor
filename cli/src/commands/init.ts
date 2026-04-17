import * as fs from 'fs';
import * as path from 'path';
import { saveConfig } from '../config';

interface InitOptions {
  token: string;
  project?: string;
  backend: string;
}

export async function initCommand(options: InitOptions) {
  console.log('\n🔍 API Nest — Initializing...\n');

  const cwd = process.cwd();
  const configPath = saveConfig({
    sdkToken: options.token,
    projectId: options.project,
    backendUrl: options.backend,
  });

  console.log(`✅ Config saved to: ${configPath}`);

  // Inject require hook into package.json scripts or detect entry point
  injectRegisterHook(cwd);

  console.log('\n🎉 API Nest is ready!');
  console.log('   Every HTTP call from your dev server will appear in the dashboard.');
  console.log(`   Dashboard: ${options.backend.replace('4000', '3000')}/dashboard\n`);
}

/**
 * Inserts `require('api-nest-cli/register')` at the top of the user's main entry file.
 * Supports common patterns: index.js, server.js, app.js, src/index.js, src/main.js
 */
function injectRegisterHook(cwd: string) {
  const candidates = [
    'index.js', 'server.js', 'app.js',
    'src/index.js', 'src/server.js', 'src/app.js',
    'index.ts', 'server.ts', 'app.ts',
    'src/index.ts', 'src/server.ts', 'src/app.ts',
  ];

  // Try to find main from package.json
  let mainFile: string | null = null;
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { main?: string };
      if (pkg.main) mainFile = pkg.main;
    } catch { /* ignore */ }
  }

  const toCheck = mainFile
    ? [mainFile, ...candidates]
    : candidates;

  for (const candidate of toCheck) {
    const full = path.join(cwd, candidate);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf-8');
      const hook = `require('api-nest-cli/register'); // [api-nest]\n`;
      if (content.includes('[api-nest]')) {
        console.log(`ℹ️  Register hook already present in ${candidate}`);
        return;
      }
      fs.writeFileSync(full, hook + content, 'utf-8');
      console.log(`✅ Injected monitor hook into: ${candidate}`);
      return;
    }
  }

  // Fallback — just tell the user
  console.log('\n⚠️  Could not auto-detect your entry file.');
  console.log('   Manually add this line to the TOP of your main file:');
  console.log("   require('api-nest-cli/register');\n");
}

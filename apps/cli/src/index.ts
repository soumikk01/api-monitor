#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init';

const program = new Command();

program
  .name('apio')
  .description('Apio CLI — stream your dev app HTTP calls to the dashboard')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize Apio in the current project')
  .requiredOption('--token <token>', 'Your SDK token (from dashboard → Get Command)')
  .option('--project <projectId>', 'Project ID to associate calls with (optional)')
  .option('--backend <url>', 'Backend URL', 'http://localhost:4000')
  .action(initCommand);

program.parse(process.argv);

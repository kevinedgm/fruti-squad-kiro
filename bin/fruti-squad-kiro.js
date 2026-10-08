#!/usr/bin/env node
const path = require('path');
const { install } = require('../lib/install.cjs');

const args = process.argv.slice(2);
const command = args[0] && !args[0].startsWith('-') ? args.shift() : 'install';

if (command === 'help' || args.includes('--help') || args.includes('-h')) {
  console.log(`Fruti Squad for Kiro

Usage:
  fruti-squad-kiro install [--force] [--dry-run] [--target <path>]

Options:
  --force       overwrite existing files that differ
  --dry-run     show what would change without writing
  --target PATH install into PATH instead of the current project`);
  process.exit(0);
}

if (command !== 'install') {
  console.error(`Unknown command: ${command}`);
  process.exit(2);
}

let target = process.cwd();
const targetIndex = args.indexOf('--target');
if (targetIndex >= 0) {
  if (!args[targetIndex + 1]) {
    console.error('--target requires a path');
    process.exit(2);
  }
  target = path.resolve(args[targetIndex + 1]);
}

try {
  install({
    target,
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run')
  });
} catch (err) {
  console.error(`fruti-squad-kiro: ${err.message}`);
  process.exit(1);
}

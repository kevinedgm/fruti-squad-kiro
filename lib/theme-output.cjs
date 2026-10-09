const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Compile and validate before touching any consumer files. No network or shell.
function compileTheme(config) {
  const run = spawnSync(process.execPath, [path.join(__dirname, 'theme-engine.mjs')], {
    input: JSON.stringify(config), encoding: 'utf8', timeout: 30000, maxBuffer: 8 * 1024 * 1024
  });
  if (run.error || run.status !== 0) throw new Error('Theme engine failed: ' + (run.error?.message || run.stderr.trim()));
  const result = JSON.parse(run.stdout);
  if (!result.ok) throw new Error('Theme validation failed: ' + result.issues.filter(x => x.severity === 'error').map(x => x.message || x.why || JSON.stringify(x)).join('; '));
  return result;
}

function writeTheme(target, config, compiled = compileTheme(config)) {
  const files = {
    '.fruti/theme/config.json': JSON.stringify(config, null, 2) + '\n',
    '.fruti/theme/tokens.css': compiled.css,
    '.fruti/theme/tokens.json': JSON.stringify(compiled.doc, null, 2) + '\n'
  };
  const previous = new Map();
  try {
    for (const [relative, content] of Object.entries(files)) {
      const file = path.join(target, relative);
      previous.set(file, fs.existsSync(file) ? fs.readFileSync(file) : null);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
    }
  } catch (error) {
    for (const [file, content] of previous) {
      if (content === null) { if (fs.existsSync(file)) fs.unlinkSync(file); }
      else fs.writeFileSync(file, content);
    }
    throw error;
  }
  return { generated: Object.keys(files).slice(1), warnings: compiled.issues.filter(x => x.severity !== 'error'), diagnostics: compiled.diagnostics };
}

function assertStarterMode(target) {
  const stateFile = path.join(target, '.fruti/state/current.json');
  if (!fs.existsSync(stateFile)) return;
  const profile = JSON.parse(fs.readFileSync(stateFile, 'utf8')).profile_path;
  if (!profile) return;
  const file = path.resolve(target, profile);
  if (!fs.existsSync(file)) throw new Error('Active theme profile is missing: ' + profile);
  const text = fs.readFileSync(file, 'utf8');
  const block = text.match(/^theming:\s*\n((?:[ \t]+[^\n]*\n|\n)*)/m)?.[1];
  const mode = block?.match(/^\s+mode:\s*["']?(starter|existing)["']?\s*$/m)?.[1];
  if (mode !== 'starter') throw new Error('The active profile does not declare theming.mode: starter. Preserve the existing theme source; do not generate starter tokens.');
}

module.exports = { compileTheme, writeTheme, assertStarterMode };

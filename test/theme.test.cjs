const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { install } = require('../lib/install.cjs');
const { initProject } = require('../lib/init.cjs');
const { updateTheme } = require('../lib/theme.cjs');
const { compileTheme } = require('../lib/theme-output.cjs');

const target = fs.mkdtempSync(path.join(os.tmpdir(), 'fruti-theme-'));
const file = name => path.join(target, '.fruti/theme', name);
const read = name => fs.readFileSync(file(name), 'utf8');
try {
  install({ target, quiet: true });
  initProject({ target, name: 'Theme test' });
  assert(read('tokens.css').includes(':root'));
  assert(JSON.parse(read('tokens.json')).color.tokens.length > 0);
  const patch = { brand: '#052a76', accent: '#c2d225', font: "'Poppins', 'Inter', system-ui, sans-serif" };
  const updated = updateTheme({ target, patch });
  assert.deepStrictEqual(updated.generated, ['.fruti/theme/tokens.css', '.fruti/theme/tokens.json']);
  assert(read('tokens.css').includes('--g-color-brand: #052A76;'));
  assert(read('tokens.css').includes('--g-color-accent: #C2D225;'));
  assert(read('tokens.css').includes(patch.font));
  const compiled = compileTheme(JSON.parse(read('config.json')));
  assert.strictEqual(read('tokens.css'), compiled.css, 'CSS must match the actual validated engine result');
  assert.deepStrictEqual(JSON.parse(read('tokens.json')), compiled.doc);
  assert(compiled.ok);

  const snapshot = () => ['config.json', 'tokens.css', 'tokens.json'].map(read);
  const beforeShow = snapshot();
  updateTheme({ target, show: true });
  assert.deepStrictEqual(snapshot(), beforeShow, '--show is read-only');
  assert.throws(() => updateTheme({ target, patch: { overrides: { '--g-color-text': '#FFFFFF' } } }), /validation failed/);
  assert.deepStrictEqual(snapshot(), beforeShow, 'failed validation preserves config and both outputs');

  // Direct JSON edits are consumed by the public CLI without flags.
  const manual = JSON.parse(read('config.json'));
  manual.brand = '#7A1F5C';
  fs.writeFileSync(file('config.json'), JSON.stringify(manual));
  const run = spawnSync(process.execPath, [path.resolve(__dirname, '../bin/fruti-squad-codex.js'), 'theme', '--target', target], { encoding: 'utf8' });
  assert.strictEqual(run.status, 0, run.stderr);
  assert(read('tokens.css').includes('--g-color-brand: #7A1F5C;'));
  assert(run.stdout.includes('.fruti/theme/tokens.css'));
  const retained = read('config.json');
  initProject({ target, name: 'Theme test' });
  assert.strictEqual(read('config.json'), retained, 'repeated init preserves user inputs');

  // A stale starter config must not override an active existing design system.
  const profile = path.join(target, '.agents/skills/lima/profiles/theme-test.md');
  fs.writeFileSync(profile, fs.readFileSync(profile, 'utf8').replace('mode: starter', 'mode: existing'));
  const beforeExisting = snapshot();
  assert.throws(() => updateTheme({ target, patch }), /does not declare/);
  assert.throws(() => initProject({ target, name: 'Theme test' }), /does not declare/);
  assert.deepStrictEqual(snapshot(), beforeExisting);
  fs.writeFileSync(path.join(target, 'tokens.css'), '/* existing source */');
  initProject({ target, name: 'Theme test', themeMode: 'existing', themeSource: 'tokens.css' });
  assert.deepStrictEqual(snapshot(), beforeExisting, 'existing init does not generate starter outputs');
  assert.strictEqual(fs.readFileSync(path.join(target, 'tokens.css'), 'utf8'), '/* existing source */');
  console.log('theme generation tests passed');
} finally {
  fs.rmSync(target, { recursive: true, force: true });
}

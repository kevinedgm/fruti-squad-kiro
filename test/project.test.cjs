const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { install } = require('../lib/install.cjs');
const { initProject } = require('../lib/init.cjs');
const { updateProject } = require('../lib/project.cjs');

const target = fs.mkdtempSync(path.join(os.tmpdir(), 'fruti-project-'));
const cli = args => spawnSync(process.execPath, [path.resolve(__dirname, '../bin/fruti-squad-codex.js'), ...args, '--target', target], { encoding: 'utf8' });
const read = relative => fs.readFileSync(path.join(target, relative), 'utf8');
try {
  install({ target, quiet: true });
  fs.mkdirSync(path.join(target, 'ui/components'), { recursive: true });
  fs.mkdirSync(path.join(target, 'src/components'), { recursive: true });
  fs.writeFileSync(path.join(target, 'ui/components/Button.vue'), '<template><button>Example</button></template>');
  initProject({ target, name: 'Project fixture', framework: 'vue3', components: ['ui/components'], cssPrefix: 'nsa-ui' });
  assert(read('.codex/qa/project-components.md').includes('Coco R0'));
  const protectedFiles = ['.fruti/state/current.json', '.fruti/theme/config.json', '.fruti/theme/tokens.css', '.agents/skills/lima/profiles/project-fixture.md', 'ui/components/Button.vue'];
  const before = protectedFiles.map(read);
  const run = cli(['project', '--components', 'ui/components', '--components', 'src/components']);
  assert.strictEqual(run.status, 0, run.stderr);
  const config = JSON.parse(read('.fruti/project.json'));
  assert.deepStrictEqual(config, { framework: 'vue3', component_roots: ['ui/components', 'src/components'], css_prefix: 'nsa-ui' });
  assert.deepStrictEqual(protectedFiles.map(read), before, 'configuration must preserve profile, theme, state and product');
  const saved = read('.fruti/project.json');
  assert.strictEqual(cli(['project', '--show']).status, 0);
  assert.strictEqual(read('.fruti/project.json'), saved);
  for (const options of [
    { components: ['missing'] }, { components: ['../outside'] },
    { cssPrefix: 'g' }, { cssPrefix: 'v-card' }, { cssPrefix: 'bs-ui' },
    { cssPrefix: 'bootstrap-ui' }, { cssPrefix: 'btn' }, { cssPrefix: 'bad prefix' },
    { framework: '' }
  ]) {
    assert.throws(() => updateProject({ target, ...options }));
    assert.strictEqual(read('.fruti/project.json'), saved, 'invalid settings must not overwrite current configuration');
  }
  assert.notStrictEqual(cli(['project', '--components']).status, 0);
  assert.notStrictEqual(cli(['project', '--framework']).status, 0);
  assert.notStrictEqual(cli(['project', '--css-prefix']).status, 0);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'fruti-outside-'));
  try {
    fs.symlinkSync(outside, path.join(target, 'external'), 'dir');
    assert.throws(() => updateProject({ target, components: ['external'] }), /symlink leaves/);
  } finally { fs.rmSync(outside, { recursive: true, force: true }); }
  const beforeInvalidInit = protectedFiles.map(read);
  assert.throws(() => initProject({ target, components: ['missing'] }), /not found/);
  assert.deepStrictEqual(protectedFiles.map(read), beforeInvalidInit);
  updateProject({ target, components: ['src/components'] });
  assert.deepStrictEqual(JSON.parse(read('.fruti/project.json')).component_roots, ['src/components']);
  console.log('Project settings tests passed: paths, stack declarations, namespaces and preservation; live component reuse not executed');
} finally { fs.rmSync(target, { recursive: true, force: true }); }

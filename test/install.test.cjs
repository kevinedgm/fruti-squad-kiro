const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { install } = require('../lib/install.cjs');
const { initProject } = require('../lib/init.cjs');
const { updateTheme } = require('../lib/theme.cjs');

const target = fs.mkdtempSync(path.join(os.tmpdir(), 'fruti-squad-kiro-'));

let result = install({ target, quiet: true });
assert(result.created.length > 0, 'expected files to be created');
assert(fs.existsSync(path.join(target, '.kiro', 'agents', 'fruti-squad.md')));
assert(fs.existsSync(path.join(target, '.kiro', 'skills', 'bruno', 'SKILL.md')));
assert(fs.existsSync(path.join(target, '.fruti', 'runtime', 'bruno.yaml')));
assert(fs.existsSync(path.join(target, '.fruti', 'contracts', 'theming.yaml')));
assert(fs.existsSync(path.join(target, '.fruti', 'defaults', 'theme.json')));
assert(fs.existsSync(path.join(target, '.fruti', 'identity', 'avatars.json')));

const profileDir = path.join(target, '.kiro', 'skills', 'lima', 'profiles');
const activeBefore = fs.readdirSync(profileDir).filter((name) => name.endsWith('.md') && name !== '_TEMPLATE.md');
assert.strictEqual(activeBefore.length, 0, 'install must not create an active project profile');

const init = initProject({ target, name: 'Example App' });
assert.strictEqual(init.themeMode, 'starter');
assert.strictEqual(init.themeSource, '.fruti/theme/config.json');
assert(fs.existsSync(path.join(target, '.fruti', 'theme', 'config.json')));
assert(fs.existsSync(path.join(target, '.kiro', 'skills', 'lima', 'profiles', 'example-app.md')));
assert(fs.existsSync(path.join(target, 'design-hub', 'system', 'registry.json')));

const theme = JSON.parse(fs.readFileSync(path.join(target, '.fruti', 'theme', 'config.json'), 'utf8'));
assert.strictEqual(theme.brand, '#1F1F1F');
assert.strictEqual(theme.accent, '#0B63CE');
assert.strictEqual(theme.radius, 6);
assert.strictEqual(theme.space, 4);
assert.strictEqual(theme.dark, true);

const changedTheme = updateTheme({
  target,
  patch: { brand: '#7A1F5C', radius: 12, shape: 'pill', dark: false }
});
assert.deepStrictEqual(changedTheme.changed.sort(), ['brand', 'dark', 'radius', 'shape'].sort());
const themeAfter = JSON.parse(fs.readFileSync(path.join(target, '.fruti', 'theme', 'config.json'), 'utf8'));
assert.strictEqual(themeAfter.brand, '#7A1F5C');
assert.strictEqual(themeAfter.accent, '#0B63CE', 'unchanged values must be preserved');
assert.strictEqual(themeAfter.radius, 12);
assert.strictEqual(themeAfter.shape, 'pill');
assert.strictEqual(themeAfter.dark, false);

assert.throws(
  () => updateTheme({ target, patch: { brand: 'red-ish' } }),
  /brand must be/
);

const shown = updateTheme({ target, show: true });
assert.strictEqual(shown.config.brand, '#7A1F5C');

const state = JSON.parse(fs.readFileSync(path.join(target, '.fruti', 'state', 'current.json'), 'utf8'));
assert.strictEqual(state.profile_path, '.kiro/skills/lima/profiles/example-app.md');
assert.strictEqual(state.registry_path, 'design-hub/system/registry.json');

const second = initProject({ target, name: 'Example App' });
assert.strictEqual(second.profileStatus, 'skipped', 'init must preserve an existing profile without --force');

const protectedFile = path.join(target, '.kiro', 'steering', 'fruti-squad.md');
fs.writeFileSync(protectedFile, 'local override\n');
result = install({ target, quiet: true });
assert(result.conflicts.includes(path.join('.kiro', 'steering', 'fruti-squad.md')));
assert.strictEqual(fs.readFileSync(protectedFile, 'utf8'), 'local override\n');

console.log('installer/init tests passed');

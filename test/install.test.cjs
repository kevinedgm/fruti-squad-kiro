const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { install } = require('../lib/install.cjs');

const target = fs.mkdtempSync(path.join(os.tmpdir(), 'fruti-squad-kiro-'));

let result = install({ target, quiet: true });
assert(result.created.length > 0, 'expected files to be created');
assert(fs.existsSync(path.join(target, '.kiro', 'agents', 'fruti-squad.md')));
assert(fs.existsSync(path.join(target, '.kiro', 'agents', 'bruno.md')));
assert(fs.existsSync(path.join(target, '.kiro', 'skills', 'bruno', 'SKILL.md')));
assert(fs.existsSync(path.join(target, '.fruti', 'runtime', 'bruno.yaml')));
assert(fs.existsSync(path.join(target, '.fruti', 'identity', 'avatars.json')));
assert(fs.existsSync(path.join(target, '.fruti', 'assets', 'avatars', 'kiwi', 'kiwi.svg')));
assert(fs.existsSync(path.join(target, '.fruti', 'assets', 'avatars', 'fruti-squad', 'fruti-squad-tile.svg')));

result = install({ target, quiet: true });
assert.strictEqual(result.conflicts.length, 0, 'second install should be idempotent');
assert(result.unchanged.length > 0, 'second install should report unchanged files');

const protectedFile = path.join(target, '.kiro', 'steering', 'fruti-squad.md');
fs.writeFileSync(protectedFile, 'local override\n');
result = install({ target, quiet: true });
assert(result.conflicts.includes(path.join('.kiro', 'steering', 'fruti-squad.md')));
assert.strictEqual(fs.readFileSync(protectedFile, 'utf8'), 'local override\n');

result = install({ target, force: true, quiet: true });
assert(!result.conflicts.length, 'force install should resolve conflicts');
assert.notStrictEqual(fs.readFileSync(protectedFile, 'utf8'), 'local override\n');

console.log('installer tests passed');

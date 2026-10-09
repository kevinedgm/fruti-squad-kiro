const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Register the installed package; never make another maintained copy of its skills.
function registerPlugin({ target = process.cwd(), source = path.resolve(__dirname, '..'), dryRun = false, quiet = false } = {}) {
  target = fs.realpathSync(path.resolve(target));
  source = fs.realpathSync(path.resolve(source));
  const relative = path.relative(target, source).split(path.sep).join('/');
  if (!relative || relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) {
    throw new Error('Plugin source must be an installed package inside the target project; run from the consumer project with node_modules/fruti-squad-codex installed.');
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(source, '.codex-plugin/plugin.json'), 'utf8'));
  if (manifest.name !== 'fruti-squad-codex') throw new Error('Unexpected plugin identity');
  const localPath = value => {
    if (typeof value !== 'string' || !value.startsWith('./') || value.split('/').includes('..')) throw new Error('Invalid plugin resource path');
    const resource = fs.realpathSync(path.join(source, value));
    const rel = path.relative(source, resource);
    if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw new Error('Plugin resource escapes package');
    return resource;
  };
  if (!fs.statSync(localPath(manifest.skills)).isDirectory()) throw new Error('Missing plugin skills directory');
  for (const key of ['composerIcon', 'logo']) {
    if (!fs.statSync(localPath(manifest.interface[key])).isFile()) throw new Error('Missing plugin branding asset');
  }
  const file = path.join(target, '.agents/plugins/marketplace.json');
  const exists = fs.existsSync(file);
  const original = exists ? fs.readFileSync(file, 'utf8') : null;
  const market = exists ? JSON.parse(original) : { name: 'fruti-local', interface: { displayName: 'Fruti Squad local' }, plugins: [] };
  if (typeof market.name !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(market.name) || !Array.isArray(market.plugins)) throw new Error('Invalid existing marketplace; preserved for manual review');
  const entry = { name: manifest.name, source: { source: 'local', path: './' + relative }, policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Productivity' };
  const matches = market.plugins.filter(p => p.name === manifest.name);
  if (matches.length > 1) throw new Error('Duplicate Fruti marketplace entries; preserved for manual review');
  if (matches.length && JSON.stringify(matches[0]) !== JSON.stringify(entry)) throw new Error('Existing Fruti marketplace entry differs; preserved for manual reconciliation');
  const changed = matches.length === 0;
  if (changed) market.plugins.push(entry);
  let backup = null;
  if (changed && !dryRun) {
    if (exists) {
      const hash = crypto.createHash('sha256').update(original).digest('hex');
      backup = path.join(target, '.fruti/backups/codex-tools', hash, '.agents/plugins/marketplace.json');
      fs.mkdirSync(path.dirname(backup), { recursive: true }); fs.writeFileSync(backup, original);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(market, null, 2) + '\n');
  }
  const result = { file, source, plugin: manifest.name, version: manifest.version, marketplace: market.name, changed, dryRun, backup, desktop: 'not_verified' };
  if (!quiet) {
    console.log(JSON.stringify(result, null, 2));
    console.log('Registered means discoverable, not installed/enabled. Save work, reload ChatGPT desktop, and install Fruti Squad from this marketplace. Select the plugin origin when local skills have the same name.');
  }
  return result;
}
module.exports = { registerPlugin };

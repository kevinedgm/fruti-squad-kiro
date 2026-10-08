const fs = require('fs');
const path = require('path');

const HEX = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }

function validatePatch(patch) {
  const errors = [];
  const color = (k) => { if (patch[k] !== undefined && (!HEX.test(patch[k]))) errors.push(k + ' must be #RGB or #RRGGBB'); };
  color('brand'); color('accent'); color('primary');
  const range = (k,min,max,int=false) => {
    if (patch[k] === undefined) return;
    const v = patch[k];
    if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max || (int && !Number.isInteger(v))) errors.push(k + ' must be ' + (int ? 'an integer ' : '') + 'between ' + min + ' and ' + max);
  };
  range('radius',0,64); range('space',1,16); range('fontSize',8,32); range('typeScale',1,2); range('categories',0,12,true);
  if (patch.shape !== undefined && !['rounded','pill'].includes(patch.shape)) errors.push('shape must be rounded or pill');
  if (patch.neutrals !== undefined && !['tinted','pure'].includes(patch.neutrals)) errors.push('neutrals must be tinted or pure');
  if (patch.neutralsHue !== undefined && !['brand','accent'].includes(patch.neutralsHue)) errors.push('neutralsHue must be brand or accent');
  if (patch.semanticCollision !== undefined && !['warn','adjust'].includes(patch.semanticCollision)) errors.push('semanticCollision must be warn or adjust');
  for (const k of ['font','fontDisplay']) if (patch[k] !== undefined && (typeof patch[k] !== 'string' || !patch[k].trim())) errors.push(k + ' must be a non-empty string');
  if (patch.dark !== undefined && typeof patch.dark !== 'boolean') errors.push('dark must be boolean');
  if (errors.length) throw new Error(errors.join('; '));
}

function updateTheme({ target, patch = {}, show = false, reset = false } = {}) {
  target = path.resolve(target || process.cwd());
  const configFile = path.join(target, '.fruti', 'theme', 'config.json');
  const defaultsFile = path.join(target, '.fruti', 'defaults', 'theme.json');
  if (!fs.existsSync(configFile)) throw new Error('No starter theme config found. Run `npx fruti-squad-codex init` first, or use --theme existing for an existing design system.');
  if (!fs.existsSync(defaultsFile)) throw new Error('Theme defaults not found. Reinstall Fruti Squad.');
  const current = readJson(configFile);
  if (show) return { file: '.fruti/theme/config.json', config: current, changed: [] };
  validatePatch(patch);
  const next = reset ? Object.assign({ name: current.name || path.basename(target) }, readJson(defaultsFile)) : Object.assign({}, current, patch);
  const changed = Object.keys(next).filter((k) => JSON.stringify(current[k]) !== JSON.stringify(next[k]));
  fs.writeFileSync(configFile, JSON.stringify(next, null, 2) + '\n');
  return { file: '.fruti/theme/config.json', config: next, changed };
}

module.exports = { updateTheme, validatePatch };

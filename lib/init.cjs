const fs = require('fs');
const path = require('path');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

function slugify(value) {
  return String(value || 'project')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

function detectThemeSource(target) {
  const candidates = [
    'grana.config.json',
    'tokens.json',
    'tokens.css',
    'src/tokens.css',
    'src/styles/tokens.css',
    'src/theme/tokens.css',
    'theme.json',
    'tailwind.config.ts',
    'tailwind.config.js'
  ];
  return candidates.find((p) => fs.existsSync(path.join(target, p))) || null;
}

function themeOverrides(options) {
  const out = {};
  const keys = ['brand','accent','primary','radius','shape','space','font','fontDisplay','fontSize','typeScale','neutrals','neutralsHue','semanticCollision','categories','dark'];
  for (const key of keys) if (options[key] !== undefined) out[key] = options[key];
  return out;
}

function writeFileSafe(file, content, force) {
  if (fs.existsSync(file) && !force) return 'skipped';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return 'written';
}

function initProject(options = {}) {
  const target = path.resolve(options.target || process.cwd());
  const projectName = options.name || path.basename(target);
  const designSystem = options.designSystem || projectName;
  const themeMode = options.themeMode || 'starter';
  const hubRoot = options.hub || 'design-hub';
  const qa = options.qa || 'none';
  const force = Boolean(options.force);
  if (!['starter','existing'].includes(themeMode)) throw new Error('--theme must be starter or existing');
  if (!['none','playwright'].includes(qa)) throw new Error('--qa must be none or playwright');

  const defaultsPath = path.join(target, '.fruti', 'defaults', 'theme.json');
  if (!fs.existsSync(defaultsPath)) throw new Error('Fruti Squad is not installed in target; run install first.');

  let source;
  let configRel = null;
  if (themeMode === 'starter') {
    const base = readJson(defaultsPath);
    const config = Object.assign({ name: designSystem }, base, themeOverrides(options));
    configRel = '.fruti/theme/config.json';
    writeFileSafe(path.join(target, configRel), JSON.stringify(config, null, 2) + '\n', force);
    source = configRel;
  } else {
    source = options.themeSource || detectThemeSource(target);
    if (!source) throw new Error('No existing theme source found. Pass --theme-source <path>.');
  }

  const slug = slugify(projectName);
  const profileRel = '.agents/skills/lima/profiles/' + slug + '.md';
  const registryRel = path.posix.join(hubRoot.replace(/\\/g, '/'), 'system/registry.json');

  const lines = [
    '# Profile — ' + projectName,
    '',
    '```yaml',
    'name: ' + JSON.stringify(projectName),
    'design_system: ' + JSON.stringify(designSystem),
    '',
    'theming:',
    '  mode: ' + themeMode,
    '  strategy: short-input-derived-tokens',
    '  contract: .fruti/contracts/theming.yaml',
    '  defaults: .fruti/defaults/theme.json',
    '  source: ' + source,
    '  config: ' + (configRel || 'null'),
    '  generated:',
    '    tokens: ' + (themeMode === 'starter' ? '.fruti/theme/tokens.json' : 'null'),
    '    css: ' + (themeMode === 'starter' ? '.fruti/theme/tokens.css' : 'null'),
    '',
    'truth_sources:',
    '  - ' + source,
    '',
    'color_law: "DERIVED_FROM_THEME_SOURCE"',
    'type_law: "DERIVED_FROM_THEME_SOURCE"',
    '',
    'hub_root: ' + hubRoot,
    'hub_layout:',
    '  - Foundations/{Color,Type,Icons,Tokens}',
    '  - Components',
    '  - Patterns',
    '  - Responsive/{Mobile,Tablet,Desktop}',
    'registry_path: ' + registryRel,
    '',
    'production:',
    '  detect: true',
    '  known_stack: AUTO',
    '  token_binding: "Bind production to theming.source; derived tokens are outputs, not hand-edited truth."',
    '  component_layout: AUTO',
    '',
    'implementation:',
    '  framework: AUTO',
    '  language: AUTO',
    '  styling: AUTO',
    '',
    'impeccable_path: .agents/skills/impeccable',
    '',
    'accessibility:',
    '  target: WCAG 2.2 AA',
    '  touch_min_px: 44',
    '',
    'runtime_qa:',
    '  enabled: ' + (qa === 'playwright' ? 'true' : 'false'),
    '  runner: ' + qa,
    '  viewports: [1440, 1024, 768, 390]',
    '```',
    '',
    '## Theme ownership',
    '',
    'Edit the short theme input (' + source + ') or the existing project source. Do not hand-edit derived theme outputs.',
    ''
  ];
  const profileStatus = writeFileSafe(path.join(target, profileRel), lines.join('\n'), force);

  const dirs = [
    hubRoot,
    path.join(hubRoot, 'Foundations'),
    path.join(hubRoot, 'Components'),
    path.join(hubRoot, 'Patterns'),
    path.join(hubRoot, 'Responsive'),
    path.join(hubRoot, 'system')
  ];
  if (qa === 'playwright') {
    dirs.push(path.join(hubRoot, 'qa'), path.join(hubRoot, 'qa', 'tests'), path.join(hubRoot, 'qa', 'evidence'));
  }
  for (const dir of dirs) fs.mkdirSync(path.join(target, dir), { recursive: true });

  const registryAbs = path.join(target, registryRel);
  if (!fs.existsSync(registryAbs)) fs.writeFileSync(registryAbs, '{}\n');

  const statePath = path.join(target, '.fruti', 'state', 'current.json');
  const state = fs.existsSync(statePath) ? readJson(statePath) : { version: 1 };
  state.project = projectName;
  state.profile_path = profileRel.replace(/\\/g, '/');
  state.registry_path = registryRel.replace(/\\/g, '/');
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');

  return {
    target,
    projectName,
    designSystem,
    themeMode,
    themeSource: source,
    profile: profileRel.replace(/\\/g, '/'),
    registry: registryRel.replace(/\\/g, '/'),
    profileStatus
  };
}

module.exports = { initProject, detectThemeSource };

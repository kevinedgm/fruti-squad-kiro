#!/usr/bin/env node
const path = require('path');
const { install } = require('../lib/install.cjs');
const { registerPlugin } = require('../lib/plugin.cjs');
const { initProject } = require('../lib/init.cjs');
const { updateTheme } = require('../lib/theme.cjs');
const { updateProject } = require('../lib/project.cjs');

const argv = process.argv.slice(2);
const command = argv[0] && !argv[0].startsWith('-') ? argv.shift() : 'install';

const value = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};
const numberValue = (flag) => {
  const raw = value(flag);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(flag + ' requires a number');
  return n;
};
const componentRoots = () => {
  const roots = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === '--components') {
    if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error('--components requires a directory');
    roots.push(argv[++i]);
  }
  return roots.length ? roots : undefined;
};

if (command === 'help' || argv.includes('--help') || argv.includes('-h')) {
  console.log([
    'Fruti Squad for Codex',
    '',
    'Usage:',
    '  fruti-squad-codex install [--update-tools | --update-icons] [--force] [--dry-run] [--target <path>]',
    '  fruti-squad-codex plugin [--dry-run] [--target <path>]',
    '  fruti-squad-codex init [options]',
    '  fruti-squad-codex theme [options]',
    '  fruti-squad-codex project [--framework vue3] [--components <directory>] [--css-prefix nsa-ui] [--show] [--target <path>]',
    '  --components is repeatable; project settings are also accepted by init',
    '',
    'Init defaults:',
    '  --theme starter',
    '  --hub design-hub',
    '  --qa none',
    '  WCAG 2.2 AA · viewports 1440,1024,768,390',
    '  theme values inherit .fruti/defaults/theme.json',
    '',
    'Init options:',
    '  --name <name>',
    '  --design-system <name>',
    '  --theme starter|existing',
    '  --theme-source <path>       existing mode; autodetected when omitted',
    '  --brand <hex> --accent <hex> --primary <hex>',
    '  --radius <px> --shape rounded|pill --space <px>',
    '  --font <family> --font-display <family>',
    '  --font-size <px> --type-scale <ratio>',
    '  --neutrals tinted|pure --neutrals-hue brand|accent',
    '  --semantic-collision warn|adjust --categories <0..12>',
    '  --dark | --no-dark',
    '  --hub <path> --qa none|playwright',
    '  --force',
    '  --target <path>',
    '',
    'Theme options:',
    '  --show                     print current .fruti/theme/config.json',
    '  --reset                    restore starter defaults (keeps theme name)',
    '  --brand <hex> --accent <hex> --primary <hex>',
    '  --radius <px> --shape rounded|pill --space <px>',
    '  --font <family> --font-display <family>',
    '  --font-size <px> --type-scale <ratio>',
    '  --neutrals tinted|pure --neutrals-hue brand|accent',
    '  --semantic-collision warn|adjust --categories <0..12>',
    '  --dark | --no-dark',
    '  --target <path>'
  ].join('\n'));
  process.exit(0);
}

let target = value('--target') || process.cwd();
target = path.resolve(target);

try {
  for (const flag of ['--framework', '--css-prefix']) {
    if (argv.includes(flag) && (!value(flag) || value(flag).startsWith('--'))) throw new Error(flag + ' requires a value');
  }
  if (command === 'install') {
    install({
      target,
      force: argv.includes('--force'),
      dryRun: argv.includes('--dry-run'),
      updateTools: argv.includes('--update-tools'),
      updateIcons: argv.includes('--update-icons')
    });
  } else if (command === 'plugin') {
    registerPlugin({target, dryRun: argv.includes('--dry-run')});
  } else if (command === 'project') {
    const result = updateProject({ target, show: argv.includes('--show'), framework: value('--framework'), components: componentRoots(), cssPrefix: value('--css-prefix') });
    console.log(argv.includes('--show') ? JSON.stringify(result.config, null, 2) : 'Fruti Squad project configured → ' + result.file);
  } else if (command === 'init') {
    install({ target, force: false, quiet: true });
    const result = initProject({
      target,
      force: argv.includes('--force'),
      name: value('--name'),
      designSystem: value('--design-system'),
      framework: value('--framework'),
      components: componentRoots(),
      cssPrefix: value('--css-prefix'),
      themeMode: value('--theme') || 'starter',
      themeSource: value('--theme-source'),
      hub: value('--hub') || 'design-hub',
      qa: value('--qa') || 'none',
      brand: value('--brand'),
      accent: value('--accent'),
      primary: value('--primary'),
      radius: numberValue('--radius'),
      shape: value('--shape'),
      space: numberValue('--space'),
      font: value('--font'),
      fontDisplay: value('--font-display'),
      fontSize: numberValue('--font-size'),
      typeScale: numberValue('--type-scale'),
      neutrals: value('--neutrals'),
      neutralsHue: value('--neutrals-hue'),
      semanticCollision: value('--semantic-collision'),
      categories: numberValue('--categories'),
      dark: argv.includes('--no-dark') ? false : (argv.includes('--dark') ? true : undefined)
    });
    console.log('Fruti Squad profile initialized → ' + result.target);
    console.log('  profile:  ' + result.profile);
    console.log('  theme:    ' + result.themeMode + ' · ' + result.themeSource);
    console.log('  registry: ' + result.registry);
  } else if (command === 'theme') {
    const patch = {};
    const stringFlags = {
      '--brand':'brand','--accent':'accent','--primary':'primary','--shape':'shape',
      '--font':'font','--font-display':'fontDisplay','--neutrals':'neutrals',
      '--neutrals-hue':'neutralsHue','--semantic-collision':'semanticCollision'
    };
    for (const [flag,key] of Object.entries(stringFlags)) {
      const v = value(flag);
      if (v !== undefined) patch[key] = v;
    }
    const numberFlags = {
      '--radius':'radius','--space':'space','--font-size':'fontSize',
      '--type-scale':'typeScale','--categories':'categories'
    };
    for (const [flag,key] of Object.entries(numberFlags)) {
      const v = numberValue(flag);
      if (v !== undefined) patch[key] = v;
    }
    if (argv.includes('--no-dark')) patch.dark = false;
    else if (argv.includes('--dark')) patch.dark = true;

    const result = updateTheme({
      target,
      patch,
      show: argv.includes('--show'),
      reset: argv.includes('--reset')
    });
    if (argv.includes('--show')) {
      console.log(JSON.stringify(result.config, null, 2));
    } else {
      console.log('Fruti Squad theme updated → ' + result.file);
      console.log('  changed: ' + (result.changed.length ? result.changed.join(', ') : 'none'));
      for (const file of result.generated) console.log('  generated: ' + file);
      for (const warning of [...result.warnings, ...result.diagnostics]) console.warn('  warning: ' + (warning.message || JSON.stringify(warning)));
    }
  } else {
    console.error('Unknown command: ' + command);
    process.exit(2);
  }
} catch (err) {
  console.error('fruti-squad-codex: ' + err.message);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const CONFIG = '.fruti/project.json';
const RESERVED = /^(?:g|grana|v|vuetify|bs|bootstrap|btn|row|col|container)(?:-|$)/;

function prepareProject({ target = process.cwd(), framework, components, cssPrefix } = {}) {
  target = path.resolve(target);
  const file = path.join(target, CONFIG);
  const current = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const next = { ...current };
  if (framework !== undefined) {
    if (typeof framework !== 'string' || !framework.trim() || /[\r\n]/.test(framework)) throw new Error('--framework requires a framework/version, for example vue3');
    next.framework = framework.trim();
  }
  if (components !== undefined) {
    if (!Array.isArray(components) || !components.length) throw new Error('--components requires at least one directory');
    next.component_roots = [...new Set(components.map(root => {
      if (typeof root !== 'string' || !root.trim()) throw new Error('--components requires a directory');
      const absolute = path.resolve(target, root);
      const relative = path.relative(target, absolute);
      if (relative.startsWith('..' + path.sep) || relative === '..' || path.isAbsolute(relative)) throw new Error('Component roots must be inside the project: ' + root);
      if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) throw new Error('Component directory not found: ' + root);
      const realRelative = path.relative(fs.realpathSync(target), fs.realpathSync(absolute));
      if (realRelative === '..' || realRelative.startsWith('..' + path.sep) || path.isAbsolute(realRelative)) throw new Error('Component symlink leaves the project: ' + root);
      return (relative || '.').split(path.sep).join('/');
    }))];
  }
  if (cssPrefix !== undefined) {
    if (typeof cssPrefix !== 'string' || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(cssPrefix) || RESERVED.test(cssPrefix)) throw new Error('--css-prefix requires a custom lowercase prefix, for example nsa-ui; Grana/Bootstrap/Vuetify prefixes are reserved');
    next.css_prefix = cssPrefix;
  }
  return { target, file: CONFIG, config: next, changed: Object.keys(next).filter(k => JSON.stringify(next[k]) !== JSON.stringify(current[k])) };
}

function updateProject(options = {}) {
  const result = prepareProject(options);
  if (options.show) return prepareProject({ target: options.target });
  if (!Object.keys(result.config).length) throw new Error('Provide --framework, --components or --css-prefix; use --show to inspect current settings');
  const file = path.join(result.target, CONFIG);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(result.config, null, 2) + '\n');
  return result;
}

module.exports = { prepareProject, updateProject };

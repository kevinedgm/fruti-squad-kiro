const path = require('path');
const { install } = require('./lib/install.cjs');

const target = path.resolve(process.env.INIT_CWD || process.cwd());
const packageRoot = path.resolve(__dirname);

// Avoid provisioning into the package checkout while packing/testing itself.
if (target === packageRoot || target.startsWith(packageRoot + path.sep)) {
  process.exit(0);
}

try {
  install({ target, force: false, quiet: false });
} catch (err) {
  // Never make npm install unusable because automatic provisioning failed.
  console.warn(`fruti-squad-kiro postinstall warning: ${err.message}`);
  console.warn('Run `npx fruti-squad-kiro install` manually.');
}

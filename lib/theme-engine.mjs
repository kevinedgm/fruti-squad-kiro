import { buildTheme } from './vendor/grana/src/index.js';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const result = buildTheme(JSON.parse(input), { source: '.fruti/theme/config.json' });
if (result.css) result.css = result.css.replace('«grana theme»', '«npx fruti-squad-codex theme»');
process.stdout.write(JSON.stringify(result));

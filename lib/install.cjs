const fs = require('fs');
const path = require('path');

function sameFile(a, b) {
  try {
    return fs.readFileSync(a).equals(fs.readFileSync(b));
  } catch {
    return false;
  }
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function install({ target, force = false, dryRun = false, quiet = false } = {}) {
  const packageRoot = path.resolve(__dirname, '..');
  target = path.resolve(target || process.env.INIT_CWD || process.cwd());

  const sourceRoots = ['.agents', '.codex', '.fruti'].map(name => path.join(packageRoot, name));
  for (const sourceRoot of sourceRoots) {
    if (!fs.existsSync(sourceRoot)) throw new Error(`Source not found: ${sourceRoot}`);
  }

  const files = [...sourceRoots.flatMap(walk), path.join(packageRoot, 'AGENTS.md'), path.join(packageRoot, 'docs/codex-guia-operativa.md'), path.join(packageRoot, 'docs/codex-parity.json'), path.join(packageRoot, 'docs/codex-validacion.md')];
  const result = { target, created: [], updated: [], unchanged: [], conflicts: [] };

  for (const src of files) {
    const rel = path.relative(packageRoot, src);
    const dest = path.join(target, rel);

    if (!fs.existsSync(dest)) {
      result.created.push(rel);
      if (!dryRun) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
      continue;
    }

    if (sameFile(src, dest)) {
      result.unchanged.push(rel);
      continue;
    }

    if (!force) {
      result.conflicts.push(rel);
      continue;
    }

    result.updated.push(rel);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }

  if (!quiet) {
    const prefix = dryRun ? '[dry-run] ' : '';
    console.log(`${prefix}Fruti Squad for Codex → ${target}`);
    console.log(`  created:   ${result.created.length}`);
    console.log(`  updated:   ${result.updated.length}`);
    console.log(`  unchanged: ${result.unchanged.length}`);
    console.log(`  conflicts: ${result.conflicts.length}`);

    if (result.conflicts.length) {
      console.log('\nExisting files were preserved:');
      for (const rel of result.conflicts.slice(0, 20)) console.log(`  - ${rel}`);
      if (result.conflicts.length > 20) console.log(`  ...and ${result.conflicts.length - 20} more`);
      console.log('\nRun `npx fruti-squad-codex install --force` to overwrite conflicts.');
    }
  }

  return result;
}

module.exports = { install };

const fs = require('fs');
const path = require('path');
const crypto = require('node:crypto');

function sameFile(a, b) {
  try {
    return fs.readFileSync(a).equals(fs.readFileSync(b));
  } catch {
    return false;
  }
}

// Merge only the flat visual interface fields emitted by this package.
// Preserve prompts, policies and dependencies; leave complex YAML for manual review.
function mergeVisualMetadata(source, installed) {
  const keys = ['display_name', 'short_description', 'icon_small', 'icon_large', 'brand_color'];
  const values = Object.fromEntries(source.split('\n').map(line => line.match(/^  ([a-z_]+): (.+)$/)).filter(Boolean).map(m => [m[1], m[2]]));
  const lines = installed.split('\n');
  const starts = lines.map((line, index) => /^interface:\s*(?:#.*)?$/.test(line) ? index : -1).filter(index => index >= 0);
  if (starts.length !== 1) return null;
  const start = starts[0];
  let end = start + 1;
  while (end < lines.length && (!lines[end].trim() || /^\s|^#/.test(lines[end]))) end++;
  const seen = new Set();
  for (let i = start + 1; i < end; i++) {
    if (!lines[i].trim() || /^\s*#/.test(lines[i])) continue;
    const match = lines[i].match(/^  ([a-z_]+):\s*(.*)$/);
    if (!match || seen.has(match[1]) || /^[|>&*!{\[]/.test(match[2])) return null;
    seen.add(match[1]);
    if (keys.includes(match[1])) lines[i] = `  ${match[1]}: ${values[match[1]]}`;
  }
  const missing = keys.filter(key => !seen.has(key)).map(key => `  ${key}: ${values[key]}`);
  lines.splice(end, 0, ...missing);
  return lines.join('\n');
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

function install({ target, force = false, dryRun = false, quiet = false, updateTools = false, updateIcons = false } = {}) {
  const packageRoot = path.resolve(__dirname, '..');
  target = path.resolve(target || process.env.INIT_CWD || process.cwd());

  const sourceRoots = ['.agents', '.codex', '.fruti'].map(name => path.join(packageRoot, name));
  for (const sourceRoot of sourceRoots) {
    if (!fs.existsSync(sourceRoot)) throw new Error(`Source not found: ${sourceRoot}`);
  }

  const visualFile = rel => /^\.agents\/skills\/[^/]+\/(?:agents\/openai\.yaml|assets\/avatar-(?:small|large)\.svg)$/.test(rel.split(path.sep).join('/'));
  const allFiles = [...sourceRoots.flatMap(walk), path.join(packageRoot, 'AGENTS.md'), path.join(packageRoot, 'docs/codex-guia-operativa.md'), path.join(packageRoot, 'docs/codex-parity.json'), path.join(packageRoot, 'docs/codex-validacion.md')];
  // Visual-only synchronization never provisions or changes functional files.
  const files = updateIcons ? allFiles.filter(src => visualFile(path.relative(packageRoot, src))) : allFiles;
  const result = { target, created: [], updated: [], unchanged: [], conflicts: [], backups: [] };

  for (const src of files) {
    const rel = path.relative(packageRoot, src);
    const dest = path.join(target, rel);
    if (updateIcons) {
      const skillName = rel.split(path.sep)[2];
      if (!fs.existsSync(path.join(target, '.agents', 'skills', skillName, 'SKILL.md'))) {
        result.conflicts.push(rel);
        continue;
      }
    }

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

    const normalized = rel.split(path.sep).join('/');
    let visualMetadata;
    if (updateIcons && normalized.endsWith('/agents/openai.yaml')) {
      visualMetadata = mergeVisualMetadata(fs.readFileSync(src, 'utf8'), fs.readFileSync(dest, 'utf8'));
      if (visualMetadata === null) { result.conflicts.push(rel); continue; }
      if (visualMetadata === fs.readFileSync(dest, 'utf8')) { result.unchanged.push(rel); continue; }
    }
    const managedTool = normalized.startsWith('.codex/agents/') || normalized.startsWith('.codex/qa/') || (normalized.startsWith('.agents/skills/') && !normalized.includes('/profiles/'));
    if (!force && !(updateTools && managedTool) && !updateIcons) {
      result.conflicts.push(rel);
      continue;
    }

    if (((updateTools && managedTool) || updateIcons) && !force) {
      const bytes = fs.readFileSync(dest);
      const digest = crypto.createHash('sha256').update(bytes).digest('hex');
      const backup = path.join('.fruti', 'backups', 'codex-tools', digest, rel);
      result.backups.push(backup);
      if (!dryRun) { fs.mkdirSync(path.dirname(path.join(target,backup)), {recursive:true}); fs.writeFileSync(path.join(target,backup),bytes); }
    }
    result.updated.push(rel);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (visualMetadata !== undefined) fs.writeFileSync(dest, visualMetadata);
      else fs.copyFileSync(src, dest);
    }
  }

  if (!quiet) {
    const prefix = dryRun ? '[dry-run] ' : '';
    console.log(`${prefix}Fruti Squad for Codex → ${target}`);
    console.log(`  package:   ${require('../package.json').version}`);
    if (updateIcons) console.log('  scope:     skill UI metadata and icon assets only; desktop display not verified');
    console.log(`  created:   ${result.created.length}`);
    console.log(`  updated:   ${result.updated.length}`);
    console.log(`  unchanged: ${result.unchanged.length}`);
    console.log(`  conflicts: ${result.conflicts.length}`);

    if (result.conflicts.length) {
      console.log('\nExisting files were preserved:');
      for (const rel of result.conflicts.slice(0, 20)) console.log(`  - ${rel}`);
      if (result.conflicts.length > 20) console.log(`  ...and ${result.conflicts.length - 20} more`);
      console.log(updateIcons
        ? '\nComplex or invalid visual metadata was preserved. Review these YAML conflicts manually; prompts/policy/dependencies must remain intact.'
        : '\nUpdate packaged skills/agents/QA with `npx fruti-squad-codex install --update-tools` (backups retained). Review remaining project conflicts manually.');
    }
  }

  return result;
}

module.exports = { install };

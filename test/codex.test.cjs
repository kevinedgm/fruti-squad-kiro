const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { install } = require('../lib/install.cjs');
const { initProject } = require('../lib/init.cjs');
const target = fs.mkdtempSync(path.join(os.tmpdir(), 'fruti-codex-'));
try {
  const dry = install({target, dryRun:true, quiet:true});
  assert(dry.created.includes('AGENTS.md'));
  assert.deepEqual(fs.readdirSync(target), [], 'dry-run writes nothing');
  install({target, quiet:true});
  assert(!fs.existsSync(path.join(target, '.kiro')), 'Codex install must not install Kiro');
  for (const name of ['kiwi','lima','coco','bruno','mora','fruti-squad']) {
    assert(fs.existsSync(path.join(target,'.codex/agents',name+'.toml')));
  }
  for (const name of ['kiwi','lima','coco','bruno','mora-docs','impeccable','improve-animations','fruti-squad']) {
    assert(fs.existsSync(path.join(target,'.agents/skills',name,'SKILL.md')));
    assert(fs.existsSync(path.join(target,'.agents/skills',name,'agents/openai.yaml')));
  }
  assert(install({target,quiet:true}).created.length===0, 'idempotent install');
  for (const rel of ['AGENTS.md','.codex/config.toml','.fruti/state/current.json','.fruti/handoffs/current.json']) {
    fs.writeFileSync(path.join(target,rel), 'local project data\n');
  }
  const preserved = install({target,quiet:true});
  for (const rel of ['AGENTS.md','.fruti/state/current.json','.fruti/handoffs/current.json']) assert(preserved.conflicts.includes(rel));
  assert.equal(fs.readFileSync(path.join(target,'.codex/config.toml'),'utf8'),'local project data\n');
  assert.equal(fs.readFileSync(path.join(target,'AGENTS.md'),'utf8'),'local project data\n');
  // Updating shipped tools must preserve live project state and profiles.
  const profile = path.join(target,'.agents/skills/lima/profiles/custom.md');
  fs.writeFileSync(profile,'custom profile');
  const tool = path.join(target,'.agents/skills/kiwi/SKILL.md');
  fs.writeFileSync(tool,'old customized skill');
  const upgraded = install({target,updateTools:true,quiet:true});
  assert(upgraded.updated.includes('.agents/skills/kiwi/SKILL.md'));
  assert(upgraded.backups.some(b=>fs.readFileSync(path.join(target,b),'utf8')==='old customized skill'));
  assert.equal(fs.readFileSync(profile,'utf8'),'custom profile');
  for(const rel of ['AGENTS.md','.codex/config.toml','.fruti/state/current.json','.fruti/handoffs/current.json']) assert.equal(fs.readFileSync(path.join(target,rel),'utf8'),'local project data\n');
  assert(fs.existsSync(path.join(target,'.codex/qa/verify-delivery.cjs')));
  // Force is explicit; restores package-managed files, but never unrelated config.
  install({target,force:true,quiet:true});
  assert.equal(fs.readFileSync(path.join(target,'.codex/config.toml'),'utf8'),'local project data\n');
  const oldState = JSON.parse(fs.readFileSync(path.join(target,'.fruti/state/current.json')));
  fs.writeFileSync(path.join(target,'tokens.css'), ':root { --brand: black; }\n');
  const initialized = initProject({target,name:'Existing App',themeMode:'existing',themeSource:'tokens.css'});
  assert.equal(initialized.profile,'.agents/skills/lima/profiles/existing-app.md');
  assert(!fs.existsSync(path.join(target,'.fruti/theme/config.json')));
  const state = JSON.parse(fs.readFileSync(path.join(target,'.fruti/state/current.json')));
  assert.equal(state.round,oldState.round);
  assert.equal(state.profile_path, initialized.profile);
  const cli = path.resolve(__dirname,'../bin/fruti-squad-codex.js');
  const help = execFileSync(process.execPath,[cli,'--help'],{encoding:'utf8'});
  assert(help.includes('fruti-squad-codex install'));
  assert(!help.includes('Kiro'));
  assert.throws(()=>execFileSync(process.execPath,[cli,'test'],{stdio:'pipe'}), 'unsupported workflow verb must fail, not simulate');
  console.log('Codex host/install/CLI tests passed');
} finally {
  fs.rmSync(target,{recursive:true,force:true});
}

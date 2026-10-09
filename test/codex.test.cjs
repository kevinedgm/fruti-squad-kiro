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
  // The one-skill PNG probe must sync to existing installs and retain its SVG.
  const squadMetadata='.agents/skills/fruti-squad/agents/openai.yaml';
  const squadPng='.agents/skills/fruti-squad/assets/avatar-small.png';
  fs.writeFileSync(path.join(target,squadMetadata),fs.readFileSync(path.join(target,squadMetadata),'utf8').replace('avatar-small.png','avatar-small.svg'));
  fs.unlinkSync(path.join(target,squadPng));
  const pngDry=install({target,updateIcons:true,dryRun:true,quiet:true});
  assert(pngDry.created.includes(squadPng)); assert(pngDry.updated.includes(squadMetadata));
  assert(!fs.existsSync(path.join(target,squadPng)));
  const pngUpdate=install({target,updateIcons:true,quiet:true});
  assert(pngUpdate.created.includes(squadPng)); assert(pngUpdate.updated.includes(squadMetadata));
  assert(fs.existsSync(path.join(target,'.agents/skills/fruti-squad/assets/avatar-small.svg')));
  assert(fs.readFileSync(path.join(target,squadPng)).equals(fs.readFileSync(path.resolve(__dirname,'..',squadPng))));
  // Visual-only updates preserve functional files, even when repairing missing icons.
  const metadata = '.agents/skills/kiwi/agents/openai.yaml';
  const icon = '.agents/skills/kiwi/assets/avatar-small.svg';
  const large = '.agents/skills/kiwi/assets/avatar-large.svg';
  fs.writeFileSync(path.join(target,metadata),'interface:\n  display_name: "Old name"\n  default_prompt: "Preserve my prompt"\npolicy:\n  allow_implicit_invocation: false\n');
  fs.writeFileSync(path.join(target,icon),'outdated icon');
  fs.writeFileSync(tool,'preserve skill procedure');
  fs.writeFileSync(path.join(target,'.codex/agents/kiwi.toml'),'preserve model');
  fs.unlinkSync(path.join(target,large));
  const dryIcons = install({target,updateIcons:true,dryRun:true,quiet:true});
  assert(dryIcons.updated.includes(metadata));
  assert(!fs.existsSync(path.join(target,large)), 'visual dry-run must not create assets');
  const icons = install({target,updateIcons:true,quiet:true});
  assert.deepEqual(icons.updated.sort(),[icon,metadata].sort());
  assert.deepEqual(icons.created,[large]);
  assert(icons.backups.some(b=>fs.readFileSync(path.join(target,b),'utf8')==='outdated icon'));
  for (const rel of [icon,large]) assert(fs.readFileSync(path.join(target,rel)).equals(fs.readFileSync(path.resolve(__dirname,'..',rel))));
  const merged = fs.readFileSync(path.join(target,metadata),'utf8');
  assert(merged.includes('icon_small: "./assets/avatar-small.svg"'));
  assert(merged.includes('default_prompt: "Preserve my prompt"'));
  assert(merged.includes('allow_implicit_invocation: false'));
  fs.writeFileSync(path.join(target,metadata),'interface:\n  display_name: |\n    A multiline name\n');
  assert(install({target,updateIcons:true,quiet:true}).conflicts.includes(metadata));
  assert.equal(fs.readFileSync(tool,'utf8'),'preserve skill procedure');
  assert.equal(fs.readFileSync(path.join(target,'.codex/agents/kiwi.toml'),'utf8'),'preserve model');
  assert.equal(fs.readFileSync(profile,'utf8'),'custom profile');
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

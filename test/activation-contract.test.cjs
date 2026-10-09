// Regression checks for audited contradictions. This is not a host activation test.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {execFileSync} = require('node:child_process');
const {install} = require('../lib/install.cjs');
const root = path.resolve(__dirname,'..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const cases = JSON.parse(read('test/activation-cases.json'));
const skills = ['kiwi','lima','coco','bruno','mora-docs','impeccable','improve-animations','fruti-squad'];
assert.deepEqual([...new Set(cases.map(x=>x.expected_skill).filter(Boolean))].sort(),skills.sort());
assert(cases.some(x=>x.expected_skill===null), 'include an out-of-scope case');
for (const skill of skills) assert(cases.some(x=>x.excluded_skill===skill && x.expected_skill!==skill), 'missing exclusion example: '+skill);
const kiwi=read('.agents/skills/kiwi/SKILL.md');
assert(!kiwi.includes('Coco (R3)'), 'Kiwi must not hand functional R3 to Coco');
assert(kiwi.includes('**bruno**') && kiwi.includes('aprobado'));
const motion=read('.agents/skills/improve-animations/SKILL.md');
assert(!motion.includes('review-animations'), 'no unavailable review dependency');
assert(!motion.includes('Dispatch an executor'), 'read-only advisor cannot implement');
assert(motion.includes('Coco R0 → Lima gate → Mora'));
const plugin=JSON.parse(read('.codex-plugin/plugin.json'));
assert.equal(plugin.version,JSON.parse(read('package.json')).version);
assert.equal(plugin.skills,'./.agents/skills/');
assert(fs.existsSync(path.join(root,plugin.skills)));
// Invoke actual bundled commands from an installed project, not the skill directory.
const target=fs.mkdtempSync(path.join(os.tmpdir(),'fruti-script-regression-'));
try {
 install({target,quiet:true});
 const orchestration='.codex/qa/orchestration.md';
 assert.equal(fs.readFileSync(path.join(target,orchestration),'utf8'),read(orchestration), 'installed coordinator protocol must match package');
 for(const role of ['kiwi','lima','coco','bruno','mora-docs','fruti-squad']) assert(read('.agents/skills/'+role+'/SKILL.md').includes(orchestration), 'role must explicitly load coordination protocol: '+role);
 for(const role of ['kiwi','lima','coco','bruno','mora','fruti-squad']) assert(read('.codex/agents/'+role+'.toml').includes(orchestration), 'native agent must explicitly load coordination protocol: '+role);
 for(const skill of skills){
  const dir=path.join(target,'.agents/skills',skill);
  const ui=fs.readFileSync(path.join(dir,'agents/openai.yaml'),'utf8');
  for(const field of ['icon_small','icon_large']){
   const match=ui.match(new RegExp('  '+field+': (.+)'));
   assert(match,'missing installed icon metadata: '+skill);
   const relative=JSON.parse(match[1]);
   assert(relative.startsWith('./assets/')&&!relative.includes('..'));
   const asset=path.join(dir,relative);
   assert(fs.existsSync(asset),'installed icon file missing: '+skill);
   const bytes=fs.readFileSync(asset);
   if(relative.endsWith('.png')) {
    assert.equal(skill,'fruti-squad'); assert.equal(field,'icon_small');
    assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
    assert.equal(bytes.readUInt32BE(16),96); assert.equal(bytes.readUInt32BE(20),96);
   } else assert(bytes.toString('utf8').includes('<svg'),'expected SVG asset: '+skill);
  }
 }

 const kiwiScript='.agents/skills/kiwi/scripts/check_artifact.py';
 assert(kiwi.includes(kiwiScript));
 const help=execFileSync('python3',[kiwiScript,'--help'],{cwd:target,encoding:'utf8'});
 assert(help.includes('--fidelidad'));
 const limaScript='.agents/skills/lima/scripts/init-project.sh';
 execFileSync('bash',[limaScript,'--name','Script Test','--qa','none'],{cwd:target,stdio:'pipe'});
 assert(fs.existsSync(path.join(target,'.agents/skills/lima/profiles/script-test.md')));
 assert(fs.existsSync(path.join(target,'design-hub/system/registry.json')));
} finally {fs.rmSync(target,{recursive:true,force:true});}
console.log('Activation case coverage, ownership, advisor scope and installed script regressions passed (host selection not executed)');

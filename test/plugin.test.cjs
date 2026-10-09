const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { registerPlugin } = require('../lib/plugin.cjs');
const root = path.resolve(__dirname, '..');
const target = fs.mkdtempSync(path.join(os.tmpdir(), 'fruti-plugin-'));
try {
  const source = path.join(target, 'node_modules/fruti-squad-codex');
  for (const dir of ['.codex-plugin', 'assets']) fs.cpSync(path.join(root, dir), path.join(source, dir), {recursive:true});
  fs.mkdirSync(path.join(source, '.agents/skills'), {recursive:true});
  const config=path.join(target,'.codex/config.toml');fs.mkdirSync(path.dirname(config),{recursive:true});fs.writeFileSync(config,'# preserve configuration\n');
  const file=path.join(target,'.agents/plugins/marketplace.json');
  const dry=registerPlugin({target,source,dryRun:true,quiet:true});
  assert(dry.changed);assert(!fs.existsSync(file));
  const other={name:'other',source:{source:'local',path:'./plugins/other'},policy:{installation:'AVAILABLE',authentication:'ON_INSTALL'},category:'Productivity'};
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const before=JSON.stringify({name:'team-local',plugins:[other]},null,2)+'\n';fs.writeFileSync(file,before);
  const result=registerPlugin({target,source,quiet:true});
  assert.equal(result.marketplace,'team-local');assert.equal(fs.readFileSync(result.backup,'utf8'),before);
  const market=JSON.parse(fs.readFileSync(file));assert.deepEqual(market.plugins[0],other);
  assert.equal(market.plugins[1].source.path,'./node_modules/fruti-squad-codex');
  assert.equal(market.plugins[1].policy.installation,'AVAILABLE');
  assert(!registerPlugin({target,source,quiet:true}).changed);
  assert.equal(fs.readFileSync(config,'utf8'),'# preserve configuration\n');
  assert.throws(()=>registerPlugin({target,source:root,quiet:true}),/inside the target/);
  market.plugins[1].source.path='./some-other-source';const conflict=JSON.stringify(market);fs.writeFileSync(file,conflict);
  assert.throws(()=>registerPlugin({target,source,quiet:true}),/differs/);assert.equal(fs.readFileSync(file,'utf8'),conflict);
  fs.writeFileSync(file,'invalid json');assert.throws(()=>registerPlugin({target,source,quiet:true}));assert.equal(fs.readFileSync(file,'utf8'),'invalid json');
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'.codex-plugin/plugin.json')));
  for(const key of ['composerIcon','logo']) {
    const svg=fs.readFileSync(path.join(root,manifest.interface[key]),'utf8');
    assert(svg.includes('width="96" height="96" viewBox="0 0 24 24"'));
    assert.equal(svg.replace('width="96" height="96" ',''),fs.readFileSync(path.join(root,'.agents/skills/fruti-squad/assets/avatar-small.svg'),'utf8'));
  }
  console.log('Local plugin registration tests passed; desktop installation/render not executed');
} finally {fs.rmSync(target,{recursive:true,force:true});}

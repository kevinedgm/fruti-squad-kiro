// Real browser reproduction: static F2 passes clipping; browser detects and repair clears it.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process');
const {collect,inspectRequired}=require('../.codex/qa/collect-browser.cjs');
const {verify}=require('../.codex/qa/verify-delivery.cjs');
const {plan,review}=require('./delivery-fixtures.cjs');
const repo=path.resolve(__dirname,'..'),root=fs.mkdtempSync(path.join(os.tmpdir(),'fruti-browser-'));
function html(clip){return `<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Header fixture</title><style>body{margin:0;padding:8px;font-family:Arial;color:#111;background:#fff}header{${clip?'height:40px;overflow:hidden;':''}}h1{font-size:20px;overflow-wrap:anywhere}button{padding:12px} .wf-note{color:#555}</style></head><body><header><h1>Encabezado con información y título largo que necesita adaptarse sin recortar la acción</h1><button id="action" onclick="setTimeout(()=>this.textContent='Hecho',200)">Continuar</button></header><section data-wf-states>Carga · vacío · error · sin permiso · sin conexión</section><p class="wf-note">Conservar acceso a título y acción.</p></body></html>`}
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');let s=fs.readFileSync(path.join(root,'component.html'),'utf8');if(req.url.includes('long=1'))s=s.replace('información y título largo','información con título extraordinariamente largo, datos adicionales y contexto extenso');res.end(s)});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port;
 let tooling=process.env.FRUTI_TEST_PLAYWRIGHT?require(process.env.FRUTI_TEST_PLAYWRIGHT):require('playwright');
 if(process.env.FRUTI_TEST_CHROMIUM){const packed=require(process.env.FRUTI_TEST_CHROMIUM),chromium=tooling.chromium;tooling={chromium:{launch:async options=>chromium.launch({...options,args:packed.args.filter(a=>a!=='--single-process'),executablePath:await packed.executablePath()})}}}
 try{
  process.chdir(root);
  fs.writeFileSync('component.html',html(true));let p=plan(root,url);
  const staticOutput=execFileSync('python3',[path.join(repo,'.agents/skills/kiwi/scripts/check_artifact.py'),'component.html','--fidelidad','F2'],{encoding:'utf8'});
  assert(staticOutput.includes('0 errores · 0 avisos'));
  let evidence=await collect('plan.json','bad/evidence.json',tooling);
  assert.equal(JSON.parse(fs.readFileSync('bad/continuation.json')).status,'RETURN','capture failure automatically returns internal repair work');
  assert(JSON.parse(fs.readFileSync('bad/continuation.json')).next_actions.some(a=>a.owner==='kiwi'));
  assert(evidence.runs.some(r=>r.findings?.some(f=>f.includes('clipping'))),'actual browser catches clipped content');
  assert.equal(verify(p,review(evidence),root,'plan.json').status,'RETURN','even signed review cannot override clipping');
  fs.writeFileSync('component.html',html(false));p=plan(root,url);
  evidence=await collect('plan.json','fixed/evidence.json',tooling);
  assert(evidence.runs.every(r=>r.errors.length===0&&r.findings.length===0),JSON.stringify(evidence.runs.map(r=>({case:r.case_id,findings:r.findings,errors:r.errors}))));
  assert.equal(verify(p,evidence,root,'plan.json').status,'IN_PROGRESS','actual capture still needs independent image review');
  // Synthetic review is ONLY for testing gate plumbing, not a product acceptance claim.
  assert.equal(verify(p,review(evidence),root,'plan.json').status,'READY_FOR_USER_REVIEW');
  assert.equal(JSON.parse(fs.readFileSync('fixed/continuation.json')).status,'IN_PROGRESS','successful capture continues to independent review');
  const missing=plan(root,url);missing.cases.find(c=>c.id==='normal-390').actions=[{type:'click',selector:'[data-w="390"]'}];
  fs.writeFileSync('plan.json',JSON.stringify(missing));
  const mismatch=await collect('plan.json','mismatch/evidence.json',tooling);
  assert(mismatch.runs.find(c=>c.case_id==='normal-390').errors.some(e=>e.includes('Missing action target')));
  const next=JSON.parse(fs.readFileSync('mismatch/continuation.json'));
  assert.equal(next.status,'RETURN','390/393 mismatch is repairable, not terminal BLOCKED');
  assert(next.failed_cases.some(c=>c.id==='normal-390'));
  fs.writeFileSync('component.html',html(false).replace('<header>','<div class="wf-frame" style="height:150px;overflow:hidden"><header>').replace('</header>','</header></div>'));
  const framed=plan(root,url);
  const frameEvidence=await collect('plan.json','frame/evidence.json',tooling);
  assert(frameEvidence.runs.find(c=>c.case_id==='zoom').findings.some(f=>f.includes('clipping')),'fixed preview frame clips enlarged content');
  assert.equal(JSON.parse(fs.readFileSync('frame/continuation.json')).status,'RETURN','preview framing defect remains a repair, never waived');
  fs.writeFileSync('component.html',html(false));plan(root,url);
  const repairedFrame=await collect('plan.json','frame-fixed/evidence.json',tooling);
  assert(repairedFrame.runs.every(c=>!c.errors.length&&!c.findings.length));
  assert.equal(JSON.parse(fs.readFileSync('frame-fixed/continuation.json')).status,'IN_PROGRESS');
  const Module=require('node:module'),originalLoad=Module._load;
  fs.mkdirSync('unavailable',{recursive:true});fs.writeFileSync('unavailable/continuation.json',JSON.stringify({status:'READY_FOR_USER_REVIEW'}));
  try{
   Module._load=function(request,...args){if(request==='playwright')throw Error('simulated missing dependency');return originalLoad.call(this,request,...args)};
   await assert.rejects(collect('plan.json','unavailable/evidence.json'),/Playwright unavailable/);
  }finally{Module._load=originalLoad}
  assert.equal(JSON.parse(fs.readFileSync('unavailable/continuation.json')).status,'IN_PROGRESS','missing tooling cannot retain READY');
  fs.writeFileSync('invalid-plan.json','invalid JSON');fs.writeFileSync('unavailable/continuation.json',JSON.stringify({status:'READY_FOR_USER_REVIEW'}));
  await assert.rejects(collect('invalid-plan.json','unavailable/evidence.json',tooling),SyntaxError);
  assert.equal(JSON.parse(fs.readFileSync('unavailable/continuation.json')).status,'IN_PROGRESS','invalid input cannot retain READY');
  const realBrowser=await tooling.chromium.launch({headless:true});
  try{
   let contexts=0;
   fs.mkdirSync('interrupted',{recursive:true});fs.writeFileSync('interrupted/continuation.json',JSON.stringify({status:'READY_FOR_USER_REVIEW',plan_sha256:'old'}));
   await assert.rejects(collect('plan.json','interrupted/evidence.json',{chromium:{launch:async()=>({newContext:async options=>{if(++contexts===2)throw Error('simulated interrupted context');return realBrowser.newContext(options)},close:async()=>{}})}}),/simulated interrupted context/);
   const interrupted=JSON.parse(fs.readFileSync('interrupted/continuation.json'));
   assert.equal(interrupted.status,'IN_PROGRESS','interruption cannot retain old READY');
   assert.equal(JSON.parse(fs.readFileSync('interrupted/evidence.json')).runs.length,1);
   assert(interrupted.remaining_case_ids.length===8&&interrupted.plan_sha256!=='old');
  }finally{await realBrowser.close()}
  const browser=await tooling.chromium.launch({headless:true});
  try{const page=await browser.newPage({viewport:{width:320,height:844}});await page.setContent('<section style="height:100px;overflow:hidden"><div id="scroll" style="height:100px;overflow:auto"><p style="height:500px">Contenido desplazable</p></div></section>');assert.deepEqual(await page.locator('#scroll').evaluate(inspectRequired),[],'intentional nested scrolling remains valid');await page.evaluate(()=>document.querySelector('#scroll').style.overflow='visible');assert((await page.locator('#scroll').evaluate(inspectRequired)).some(x=>x.includes('clipping')),'unreachable clipping by outer parent fails');}finally{await browser.close()}
  const disclosureBrowser=await tooling.chromium.launch({headless:true});
  try{
   const page=await disclosureBrowser.newPage({viewport:{width:1024,height:844}});
   const markup=hidden=>`<style>body{margin:8px}nav{overflow-wrap:anywhere}@media(min-width:600px){#toggle{${hidden?'display:none':''}}}</style><header><button id="toggle" aria-expanded="false">Mostrar ruta completa</button><nav id="trail">Inicio / Operación / Inventario</nav><h1>Inventario</h1><p>Existencias y movimientos</p></header>`;
   await page.setContent(markup(false));
   assert(await page.locator('#toggle').isVisible()&&await page.locator('#trail').isVisible(),'reproduces redundant wide disclosure');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'absence of overflow does not validate density');
   await page.setContent(markup(true));
   assert(!await page.locator('#toggle').isVisible()&&await page.locator('#trail').isVisible(),'repair removes redundant wide disclosure');
   await page.setViewportSize({width:320,height:844});
   await page.addStyleTag({content:'@media(max-width:599px){#trail{display:none}#trail.open{display:block}}'});
   await page.locator('#toggle').evaluate(el=>el.onclick=()=>{document.querySelector('#trail').classList.toggle('open');el.setAttribute('aria-expanded',String(document.querySelector('#trail').classList.contains('open')))});
   assert(!await page.locator('#trail').isVisible());
   await page.locator('#toggle').focus();await page.keyboard.press('Enter');
   assert(await page.locator('#trail').isVisible());
   assert.equal(await page.locator('#toggle').getAttribute('aria-expanded'),'true');
  }finally{await disclosureBrowser.close()}
  console.log('Real Chromium regression passed: static false confidence → clipping detected → repaired render → independent review gate');
 }finally{process.chdir(repo);await new Promise(resolve=>server.close(resolve));fs.rmSync(root,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exitCode=1});

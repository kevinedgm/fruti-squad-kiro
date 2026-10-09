// Run against an actual preview. Uses existing Playwright; does not install dependencies.
const fs=require('node:fs'),path=require('node:path');
const {hash,verify,taskContractValid}=require('./verify-delivery.cjs');
async function expectedSnapshot(page,x){
 const result={};
 if(x.url!==undefined||x.urlIncludes!==undefined)result.url=page.url();
 if(x.selector){
  const loc=page.locator(x.selector);
  if(!await loc.count())return {...result,missing:true};
  if(x.visible!==undefined)result.visible=await loc.isVisible();
  if(x.text!==undefined||x.textIncludes!==undefined)result.text=await loc.textContent();
  if(x.focused!==undefined)result.focused=await loc.evaluate(el=>el===document.activeElement);
  if(x.attribute)result.attribute=await loc.getAttribute(x.attribute.name);
 }
 return result;
}
function inspectRequired(el){
 const r=el.getBoundingClientRect(),style=getComputedStyle(el),fail=[];
 if(!r.width||!r.height||style.visibility==='hidden'||style.display==='none'||style.opacity==='0')fail.push('required element not visible');
 const range=document.createRange();range.selectNodeContents(el);
 let rects=[r,...Array.from(range.getClientRects()).filter(x=>x.width&&x.height)];
 for(let p=el;p;p=p.parentElement){
  const s=getComputedStyle(p),b=p.getBoundingClientRect();
  const clipX=['hidden','clip'].includes(s.overflowX),clipY=['hidden','clip'].includes(s.overflowY);
  for(const q of rects){
   if(clipX&&(q.left<b.left-1||q.right>b.right+1))fail.push('horizontal clipping by '+p.tagName);
   if(clipY&&(q.top<b.top-1||q.bottom>b.bottom+1))fail.push('vertical clipping by '+p.tagName);
  }
  // A scrollport makes its offscreen contents reachable; clip their ranges before testing outer ancestors.
  const scrollX=['auto','scroll'].includes(s.overflowX),scrollY=['auto','scroll'].includes(s.overflowY);
  if(scrollX||scrollY)rects=rects.map(q=>({left:scrollX?Math.max(q.left,b.left):q.left,right:scrollX?Math.min(q.right,b.right):q.right,top:scrollY?Math.max(q.top,b.top):q.top,bottom:scrollY?Math.min(q.bottom,b.bottom):q.bottom})).filter(q=>q.right>q.left&&q.bottom>q.top);
 }
 const x=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2)),y=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2));
 const top=document.elementFromPoint(x,y);
 if(r.right<=0||r.left>=innerWidth||r.bottom<=0||r.top>=innerHeight||!top||!(el.contains(top)||top.contains(el)))fail.push('required element not reachable or occluded');
 return [...new Set(fail)];
}
async function collect(planPath,outPath,{chromium}={}){
 const outDir=path.dirname(outPath);fs.mkdirSync(outDir,{recursive:true});
 fs.writeFileSync(path.join(outDir,'continuation.json'),JSON.stringify({status:'IN_PROGRESS',errors:[],next_actions:[{owner:'producer',action:'Load the current plan and capture evidence; an earlier READY does not apply to this attempt.'}]},null,2)+'\n');
 const plan=JSON.parse(fs.readFileSync(planPath));
 const evidence={artifact:plan.artifact,round:plan.round,revision:plan.revision,stage:plan.stage,producer:plan.producer,plan_sha256:hash(planPath),inputs:plan.inputs,runs:[],review:{status:'NOT_REVIEWED'}};
 const save=()=>{
  const temp=outPath+'.tmp';fs.writeFileSync(temp,JSON.stringify(evidence,null,2)+'\n');fs.renameSync(temp,outPath);
  let result={status:'IN_PROGRESS',errors:[],next_actions:[{owner:plan.producer,action:'Complete current capture and independent review; do not use a continuation from an earlier run.'}]};
  try{result=verify(plan,evidence,process.cwd(),planPath)}catch(error){result.errors=[error.message]}
  const continuation={...result,plan_sha256:evidence.plan_sha256,failed_cases:evidence.runs.filter(r=>r.errors?.length||r.findings?.length).map(r=>({id:r.case_id,errors:r.errors,findings:r.findings})),remaining_case_ids:(plan.cases||[]).filter(c=>!evidence.runs.some(r=>r.case_id===c.id)).map(c=>c.id)};
  const checkpoint=path.join(outDir,'continuation.json');fs.writeFileSync(checkpoint+'.tmp',JSON.stringify(continuation,null,2)+'\n');fs.renameSync(checkpoint+'.tmp',checkpoint);
 };
 save(); // Invalidate previous READY before resolving tooling, and checkpoint progress after each case.
 if(!chromium){try{({chromium}=require('playwright'))}catch{throw Error('Playwright unavailable: continue environment recovery with existing project browser tooling; this error alone is not a terminal blocker.')}}
 const browser=await chromium.launch({headless:true});
 try{for(let i=0;i<plan.cases.length;i++){
  const c=plan.cases[i],context=await browser.newContext({viewport:{width:c.width,height:c.height}}),page=await context.newPage(),errors=[];
  page.setDefaultTimeout(5000);
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await context.tracing.start({screenshots:true,snapshots:true,sources:true});
  const findings=[];
  try{
   await page.goto(c.url,{waitUntil:'networkidle'});
   const contractOK=taskContractValid(c),firstTask=contractOK?Math.min(...c.task_contract.action_indexes):-1;
   let beforeOutcome;
   for(let ai=0;ai<(c.actions||[]).length;ai++){
    if(ai===firstTask)beforeOutcome=await Promise.all(c.task_contract.outcome_indexes.map(i=>expectedSnapshot(page,c.expected[i])));
    const a=c.actions[ai];
    if(a.selector&&await page.locator(a.selector).count()===0)throw Error('Missing action target '+a.selector+'; repair preview controls or plan before recapturing');
    if(a.type==='fill')await page.locator(a.selector).fill(a.value);else if(a.type==='click')await page.locator(a.selector).click();else if(a.type==='press')await page.keyboard.press(a.key);else throw Error('unsupported setup action');
   }
   if(c.zoom===2)await page.evaluate(()=>{document.documentElement.style.zoom='2'});
   await page.evaluate(()=>document.fonts.ready);
   for(const x of c.expected||[]){
    const deadline=Date.now()+5000;let failures=[];
    do{
     failures=[];const actual=await expectedSnapshot(page,x);
     if(actual.missing&&(x.text!==undefined||x.textIncludes!==undefined||x.focused!==undefined||x.attribute||x.visible===true))failures.push(x.selector+': expected target missing');
     if(x.visible!==undefined&&(actual.visible??false)!==x.visible)failures.push(x.selector+': wrong visibility');
     if(x.text!==undefined&&actual.text!==x.text)failures.push(x.selector+': wrong state text');
     if(x.textIncludes!==undefined&&!actual.text?.includes(x.textIncludes))failures.push(x.selector+': state content missing');
     if(x.focused!==undefined&&actual.focused!==x.focused)failures.push(x.selector+': wrong focus');
     if(x.attribute&&actual.attribute!==x.attribute.value)failures.push(x.selector+': wrong attribute '+x.attribute.name);
     if(x.url!==undefined&&actual.url!==x.url)failures.push('wrong destination URL');
     if(x.urlIncludes!==undefined&&!actual.url?.includes(x.urlIncludes))failures.push('destination URL missing expected segment');
     if(!failures.length||Date.now()>=deadline)break;
     await page.waitForTimeout(50);
    }while(Date.now()<deadline);
    findings.push(...failures);
   }
   const afterOutcome=contractOK?await Promise.all(c.task_contract.outcome_indexes.map(i=>expectedSnapshot(page,c.expected[i]))):undefined;
   const taskChanged=contractOK&&JSON.stringify(beforeOutcome)!==JSON.stringify(afterOutcome);
   if(c.task&&!contractOK)findings.push('Component task contract missing/invalid; separate preview setup from real task actions/outcomes');
   if(c.task&&contractOK&&!taskChanged)findings.push('Component task outcome unchanged; static title or setup controls do not prove task completion');
   const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1||document.body.scrollWidth>innerWidth+1);
   if(horizontal)findings.push('horizontal overflow');
   for(const selector of c.required||[]){
    const loc=page.locator(selector);
    if(await loc.count()!==1){findings.push(selector+': required selector must match once');continue}
    if(!await loc.isVisible()){findings.push(selector+': hidden');continue}
    await loc.scrollIntoViewIfNeeded();
    findings.push(...(await loc.evaluate(inspectRequired)).map(x=>selector+': '+x));
   }
   await page.evaluate(()=>scrollTo(0,0));
   const screenshots=[];
   for(const [label,fullPage] of [['viewport',false],['full',true]]){
    const p=path.join(outDir,`case-${i}-${label}.png`);await page.screenshot({path:p,fullPage});screenshots.push({kind:fullPage?'full-page':'viewport',path:p,sha256:hash(p)});
   }
   const tracePath=path.join(outDir,`case-${i}-trace.zip`);await context.tracing.stop({path:tracePath});
   evidence.runs.push({case_id:c.id,url:c.url,width:c.width,height:c.height,state:c.state,zoom:c.zoom,zoom_method:c.zoom===2?'css-zoom':'none',variant:c.variant,actions_executed:c.actions||[],expected_checked:c.expected||[],browser:'chromium',errors,findings,task_outcome_changed:c.task?taskChanged:false,checks:{task_completion:c.task?(taskChanged&&!findings.length?'PASS':'FAIL'):'NOT_APPLICABLE',keyboard:c.keyboard?(c.actions?.some(a=>a.type==='press')&&c.expected?.length&&!findings.length?'PASS':'FAIL'):'NOT_APPLICABLE',horizontal_overflow:horizontal?'FAIL':'PASS',clipping:findings.length?'FAIL':'PASS',required_content:findings.length?'FAIL':'PASS',required_actions:findings.length?'FAIL':'PASS'},screenshots,trace:{path:tracePath,sha256:hash(tracePath)}});
  }catch(e){
   const screenshots=[];let trace;
   try{for(const [label,fullPage] of [['viewport',false],['full',true]]){const p=path.join(outDir,`case-${i}-${label}.png`);await page.screenshot({path:p,fullPage});screenshots.push({kind:fullPage?'full-page':'viewport',path:p,sha256:hash(p)})}const p=path.join(outDir,`case-${i}-trace.zip`);await context.tracing.stop({path:p});trace={path:p,sha256:hash(p)}}catch{}
   evidence.runs.push({case_id:c.id,url:c.url,width:c.width,height:c.height,state:c.state,zoom:c.zoom,variant:c.variant,browser:'chromium',errors:[...errors,e.message],findings,checks:{clipping:'FAIL'},screenshots,trace});
  }
  finally{try{await context.close()}finally{save()}}
 }}finally{try{await browser.close()}finally{save()}}
 return evidence;
}
if(require.main===module){const [p,o]=process.argv.slice(2);if(!p||!o){console.error('Usage: node .codex/qa/collect-browser.cjs <plan.json> <evidence.json>');process.exitCode=1}else collect(p,o).then(e=>{const continuation=JSON.parse(fs.readFileSync(path.join(path.dirname(o),'continuation.json')));console.log(JSON.stringify(continuation,null,2));process.exitCode=continuation.status==='READY_FOR_USER_REVIEW'?0:1}).catch(e=>{console.error('IN_PROGRESS: diagnose and recover capture tooling:',e.message);process.exitCode=1})}
module.exports={collect,inspectRequired};

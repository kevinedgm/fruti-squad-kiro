// Evidence gate for internal review. It verifies evidence integrity, not visual taste.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const producers={F1:'kiwi',F2:'kiwi',F3:'coco',R3:'bruno',DOCS:'mora'};
const reviewers={F1:'lima',F2:'lima',F3:'lima',R3:'coco',DOCS:'coco'};
function taskContractValid(c){
 const t=c.task_contract;
 const indexes=(values,list)=>Array.isArray(values)&&values.length>0&&new Set(values).size===values.length&&values.every(i=>Number.isInteger(i)&&i>=0&&i<list.length);
 if(typeof t?.description!=='string'||!t.description.trim()||!indexes(t.action_indexes,c.actions||[])||!indexes(t.outcome_indexes,c.expected||[]))return false;
 if(t.outcome_indexes.some(i=>{const x=c.expected[i];return !x||!['text','textIncludes','visible','focused','attribute','url','urlIncludes'].some(k=>x[k]!==undefined)}))return false;
 const start=Math.min(...t.action_indexes);
 if(t.action_indexes.length!==c.actions.length-start||t.action_indexes.some((value,i)=>value!==start+i))return false; // All actions after setup belong to the task; no trailing setup can fake its outcome.
 const actions=t.action_indexes.map(i=>c.actions[i]);
 if(actions.some(a=>a.selector&&/\[\s*data-(v|w|s)\s*(?:[=~|^$*]|\])/.test(a.selector)))return false; // Preview controls set up cases, not component tasks.
 return actions.some(a=>['click','fill'].includes(a.type)||(a.type==='press'&&!/^(Shift\+)?Tab$/.test(a.key)))&&(!c.keyboard||actions.some(a=>a.type==='press'&&!/^(Shift\+)?Tab$/.test(a.key)));
}
function verify(plan,evidence,root=process.cwd(),planPath) {
 const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg)};
 const file=rel=>{check(typeof rel==='string'&&!path.isAbsolute(rel)&&!rel.split(/[\\/]/).includes('..'),'unsafe evidence path');return typeof rel==='string'?path.resolve(root,rel):''};
 const match=f=>{const p=file(f?.path);check(fs.existsSync(p)&&fs.statSync(p).isFile()&&hash(p)===f?.sha256,'missing/stale evidence: '+f?.path)};
 check(plan.version===1&&reviewers[plan.stage],'unsupported plan/stage');
 check(plan.producer===producers[plan.stage],'wrong producer for stage');
 check(plan.artifact&&plan.round&&plan.revision&&plan.producer,'missing artifact identity');
 for(const k of ['artifact','round','revision','stage','producer'])check(evidence[k]===plan[k],'identity mismatch: '+k);
 check(!!planPath,'plan file required for integrity');
 if(planPath)check(evidence.plan_sha256===hash(planPath),'stale review plan');
 check(Array.isArray(plan.inputs)&&plan.inputs.length>0,'source files required');
 for(const f of plan.inputs||[])match(f);
 check(JSON.stringify(evidence.inputs)===JSON.stringify(plan.inputs),'source inventory mismatch');
 const cases=plan.cases||[],variants=plan.variants||[];
 check(cases.length>0&&variants.length>0,'test matrix required');
 check((plan.required_states||[]).includes('normal')&&(plan.required_states||[]).includes('long-content'),'normal and long-content states required');
 check(new Set(cases.map(c=>c.id)).size===cases.length,'duplicate case ids');
 const widths=[...new Set([320,375,...(plan.profile_viewports||[])])];
 check(widths.some(w=>w>=600&&w<1024)&&widths.some(w=>w>=1024),'profile must cover medium and expanded');
 for(const v of variants){
  const vc=cases.filter(c=>c.variant===v);
  for(const w of widths)check(vc.some(c=>c.width===w&&c.state==='normal'&&c.zoom===1),`${v}: missing normal viewport ${w}`);
  for(const w of [320,375])check(vc.some(c=>c.width===w&&c.state==='long-content'),`${v}: missing long-content ${w}`);
  check(vc.some(c=>c.width<=375&&c.zoom===2),`${v}: missing 200% enlargement`);
  check(vc.some(c=>c.width<=375&&c.task&&c.actions?.length&&c.expected?.length),`${v}: missing mobile task execution`);
  check(vc.some(c=>c.width>=1024&&c.task&&c.keyboard&&c.actions?.some(a=>a.type==='press')&&c.expected?.length),`${v}: missing keyboard task execution`);
  for(const state of plan.required_states||[])check(vc.some(c=>c.state===state),`${v}: missing state ${state}`);
 }
 check(new Set((evidence.runs||[]).map(x=>x.case_id)).size===(evidence.runs||[]).length,'duplicate evidence cases');
 const shots=[],traces=[];
 for(const c of cases){
  check(variants.includes(c.variant)&&Array.isArray(c.required)&&c.required.length>0,'required content/actions selectors missing: '+c.id);
  const run=(evidence.runs||[]).find(x=>x.case_id===c.id);
  check(!!run,'missing browser case: '+c.id);if(!run)continue;
  for(const k of ['url','width','height','state','zoom','variant'])check(run[k]===c[k],`case mismatch ${c.id}: ${k}`);
  check(JSON.stringify(run.actions_executed)===JSON.stringify(c.actions||[]),'interaction trace mismatch: '+c.id);
  check(JSON.stringify(run.expected_checked)===JSON.stringify(c.expected||[]),'expected state not checked: '+c.id);
  if(c.task){check(taskContractValid(c),'component task contract missing/invalid: '+c.id);check(run.checks?.task_completion==='PASS'&&run.task_outcome_changed===true,'task incomplete/unchanged: '+c.id);}
  if(c.keyboard)check(run.checks?.keyboard==='PASS','keyboard not checked: '+c.id);
  check(run.browser==='chromium'||run.browser==='firefox'||run.browser==='webkit','real browser required');
  check(Array.isArray(run.findings)&&run.findings.length===0,'unresolved browser findings: '+c.id);
  check(c.zoom!==2||['css-zoom','native-browser-zoom','text-enlargement'].includes(run.zoom_method),'enlargement not executed: '+c.id);
  check(Array.isArray(run.errors)&&run.errors.length===0,'browser errors: '+c.id);
  for(const k of ['horizontal_overflow','clipping','required_content','required_actions'])check(run.checks?.[k]==='PASS',`${c.id}: ${k} not PASS`);
  check(Array.isArray(run.screenshots)&&run.screenshots.some(f=>f.kind==='viewport')&&run.screenshots.some(f=>f.kind==='full-page'),'viewport and full-page screenshots required: '+c.id);
  for(const f of run.screenshots||[]){match(f);shots.push(f.path);const p=file(f.path);if(fs.existsSync(p)){const b=fs.readFileSync(p);const png=b.length>=24&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));check(png,'not a PNG screenshot: '+f.path);if(png){const scale=run.device_scale_factor||1;check(b.readUInt32BE(16)===c.width*scale,'screenshot viewport width mismatch: '+f.path);if(f.kind==='viewport')check(b.readUInt32BE(20)===c.height*scale,'screenshot viewport height mismatch: '+f.path)}}}
  check(run.trace?.path,'browser trace required: '+c.id);if(run.trace){match(run.trace);traces.push(run.trace.path);const p=file(run.trace.path);if(fs.existsSync(p))check(fs.readFileSync(p).subarray(0,4).equals(Buffer.from([80,75,3,4])),'not a browser trace ZIP: '+run.trace.path)}
 }
 check(new Set(shots).size===shots.length,'reused screenshots across cases');
 check(new Set(traces).size===traces.length,'reused traces across cases');
 const objectives=plan.objectives||[];
 check(objectives.length>0&&objectives.every(o=>o.id&&typeof o.criterion==='string'&&o.criterion.trim()),'explicit user objectives required');
 check(new Set(objectives.map(o=>o.id)).size===objectives.length,'duplicate objective ids');
 const review=evidence.review||{};
 for(const variant of variants)for(const objective of objectives){
  const assessments=(review.objective_checks||[]).filter(x=>x.variant===variant&&x.objective_id===objective.id);
  check(assessments.length===1&&assessments[0].status==='PASS'&&typeof assessments[0].rationale==='string'&&assessments[0].rationale.trim()&&assessments[0].evidence_case_ids?.length&&assessments[0].evidence_case_ids.every(id=>cases.some(c=>c.id===id&&c.variant===variant))&&[c=>c.width<=375,c=>c.width>=1024].every(predicate=>assessments[0].evidence_case_ids.some(id=>cases.some(c=>c.id===id&&c.variant===variant&&predicate(c)))),`objective not demonstrated: ${variant}/${objective.id}`);
 }
 check(review.role===reviewers[plan.stage]&&review.role!==plan.producer,'independent owning reviewer required');
 check(review.status==='PASS'&&typeof review.summary==='string'&&review.summary.trim().length>0,'review not accepted');
 check(review.plan_sha256===evidence.plan_sha256,'review of another plan');
 check(Array.isArray(review.screenshots_reviewed)&&shots.every(s=>review.screenshots_reviewed.includes(s)),'screenshots not inspected by reviewer');
 check(Array.isArray(review.traces_reviewed)&&traces.every(s=>review.traces_reviewed.includes(s)),'traces not inspected by reviewer');
 for(const dim of ['structural','visual','accessibility'])check(review.dimensions?.[dim]==='PASS','review dimension not PASS: '+dim);
 check(Array.isArray(review.findings)&&review.findings.every(f=>f.status==='closed'&&f.rule_id&&f.retest_case_ids?.length&&f.retest_case_ids.every(id=>cases.some(c=>c.id===id))),'open/unretested findings');
 if(!errors.length)return {status:'READY_FOR_USER_REVIEW',errors,next_actions:[]};
 // Missing evidence is work to perform, never proof of a terminal environment block.
 const blocker=evidence.blocker;
 const terminal=blocker&&blocker.plan_sha256===evidence.plan_sha256&&planPath&&blocker.plan_sha256===hash(planPath)&&['artifact','round','revision','stage','producer'].every(k=>evidence[k]===plan[k])&&blocker.owner&&blocker.operation&&blocker.tool&&blocker.error&&blocker.required_action&&blocker.attempts?.length&&blocker.attempts.every(a=>a.operation&&a.result)&&blocker.alternatives?.length&&blocker.alternatives.every(a=>a.reason&&['unavailable','not-permitted'].includes(a.status));
 if(terminal)return {status:'BLOCKED',errors,next_actions:[{owner:blocker.owner,action:blocker.required_action}],blocker};
 const runs=evidence.runs||[];
 const failed=runs.some(r=>r.findings?.length||r.errors?.length||Object.values(r.checks||{}).some(v=>['FAIL','BLOCKED'].includes(v)))||review.status==='RETURN'||review.findings?.some(f=>f.status!=='closed')||review.objective_checks?.some(x=>x.status==='RETURN'||x.status==='FAIL');
 const status=failed?'RETURN':'IN_PROGRESS';
 return {status,errors,next_actions:[
  {owner:plan.producer,action:failed?'Repair the reported defects, then regenerate affected evidence for the current revision.':'Complete missing cases and regenerate stale evidence for the current revision.'},
  {owner:reviewers[plan.stage],action:'Inspect current captures and task traces, assess every user objective for each alternative, then return defects or complete the review.'},
  {owner:plan.producer,action:'Run this gate again; continue internally until READY_FOR_USER_REVIEW or a documented terminal blocker.'}
 ]};
}
if(require.main===module){
 try{const [planPath,evidencePath]=process.argv.slice(2);if(!planPath||!evidencePath)throw Error('Usage: node .codex/qa/verify-delivery.cjs <plan.json> <evidence.json> (project root cwd)');
  const result=verify(JSON.parse(fs.readFileSync(planPath)),JSON.parse(fs.readFileSync(evidencePath)),process.cwd(),planPath);console.log(JSON.stringify(result,null,2));process.exitCode=result.errors.length?1:0;
 }catch(e){console.error('IN_PROGRESS: repair plan/evidence input:',e.message);process.exitCode=1}
}
module.exports={verify,hash,taskContractValid};

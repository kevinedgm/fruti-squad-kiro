// Synthetic evidence tests exercise integrity/coverage, not screenshot appearance.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {verify,hash}=require('../.codex/qa/verify-delivery.cjs');
const {plan,review}=require('./delivery-fixtures.cjs');
const png=(width,height)=>{const b=Buffer.alloc(24);Buffer.from([137,80,78,71,13,10,26,10]).copy(b);b.writeUInt32BE(width,16);b.writeUInt32BE(height,20);return b}; // synthetic PNG header; no rendering claim
const root=fs.mkdtempSync(path.join(os.tmpdir(),'fruti-gate-'));
try{
 fs.writeFileSync(path.join(root,'component.html'),'<header><h1>Heading</h1><button id="action">Action</button></header>');
 const p=plan(root,'http://localhost:4321');
 const runs=p.cases.map(c=>{
  const shots=['viewport','full-page'].map(kind=>{const rel=c.id+'-'+kind+'.png';fs.writeFileSync(path.join(root,rel),png(c.width,c.height));return {kind,path:rel,sha256:hash(path.join(root,rel))}});
  const rel=c.id+'-trace.zip';fs.writeFileSync(path.join(root,rel),Buffer.from([80,75,3,4]));
  return {...c,case_id:c.id,browser:'chromium',zoom_method:c.zoom===2?'css-zoom':'none',errors:[],findings:[],actions_executed:c.actions||[],expected_checked:c.expected||[],checks:{task_completion:c.task?'PASS':'NOT_APPLICABLE',keyboard:c.keyboard?'PASS':'NOT_APPLICABLE',...Object.fromEntries(['horizontal_overflow','clipping','required_content','required_actions'].map(k=>[k,'PASS']))},screenshots:shots,trace:{path:rel,sha256:hash(path.join(root,rel))}};
 });
 const good=review({...Object.fromEntries(['artifact','round','revision','stage','producer'].map(k=>[k,p[k]])),inputs:p.inputs,plan_sha256:hash(path.join(root,'plan.json')),runs});
 const run=e=>verify(p,e,root,path.join(root,'plan.json'));
 assert.equal(run(good).status,'READY_FOR_USER_REVIEW');
 function reject(change,message){const e=structuredClone(good);change(e);assert.notEqual(run(e).status,'READY_FOR_USER_REVIEW',message)}
 reject(e=>e.review={status:'NOT_REVIEWED'},'self-check does not authorize delivery');
 reject(e=>e.review.role='kiwi','producer cannot approve itself');
 reject(e=>e.review.screenshots_reviewed=[],'uninspected screenshots');
 reject(e=>e.runs[0].checks.clipping='FAIL','mobile clipping blocks delivery');
 reject(e=>e.runs.splice(0,1),'missing viewport');
 reject(e=>e.runs[0].findings=['clipped even though checks say PASS'],'findings cannot be overridden');
 reject(e=>e.runs[1].screenshots=e.runs[0].screenshots,'reused screenshots');
 reject(e=>e.runs[1].trace=e.runs[0].trace,'reused trace');
 reject(e=>e.runs.find(r=>r.zoom===2).zoom_method='none','enlargement missing');
 assert.equal(verify(p,good,root).status,'IN_PROGRESS','plan file mandatory');
 reject(e=>e.review.traces_reviewed=[],'trace review missing');
 reject(e=>e.runs.find(r=>r.task).checks.task_completion='FAIL','task incomplete');
 reject(e=>e.runs.find(r=>r.keyboard).checks.keyboard='NOT_VERIFIED','keyboard missing');
 reject(e=>e.runs[0].width=500,'viewport altered');
 reject(e=>e.round='r02','different round');
 reject(e=>e.revision='rev-00','older revision');
 reject(e=>e.review.dimensions.visual='NOT_VERIFIED','visual not verified');
 reject(e=>e.review.findings=[{rule_id:'CLIP',status:'open',retest_case_ids:['normal-320']}],'open defects');
 reject(e=>e.review.findings=[{rule_id:'CLIP',status:'closed',retest_case_ids:[]}],'closure without retest');
 reject(e=>e.runs[0].errors=['Console error'],'browser errors');
 reject(e=>e.plan_sha256='old','modified plan');
 const pending=structuredClone(good);pending.review={status:'NOT_REVIEWED'};
 assert.equal(run(pending).status,'IN_PROGRESS','pending review continues internally');
 assert(run(pending).next_actions.some(a=>a.owner==='lima'));
 const returned=structuredClone(good);returned.review.objective_checks[0].status='RETURN';
 returned.review.objective_checks[0].rationale='Redundant disclosure competes with heading while full trail is already visible';
 assert.equal(run(returned).status,'RETURN','geometric PASS does not override failure of user objective');
 const incomplete=structuredClone(good);incomplete.runs.pop();
 assert.equal(run(incomplete).status,'IN_PROGRESS','unfinished matrix is work, not terminal block');
 incomplete.blocker={owner:'kiwi',error:'browser blocked'};
 assert.equal(run(incomplete).status,'IN_PROGRESS','vague blocker cannot end task');
 incomplete.blocker={plan_sha256:incomplete.plan_sha256,owner:'kiwi',operation:'capture remaining case',tool:'chromium',error:'Executable absent',required_action:'Provide a permitted browser executable',attempts:[{operation:'launch existing browser',result:'Executable absent'}],alternatives:[{status:'not-permitted',reason:'Environment forbids installing a browser'}]};
 assert.equal(run(incomplete).status,'BLOCKED','documented unavailable recovery route is a terminal block');
 const staleBlock=structuredClone(incomplete);staleBlock.plan_sha256='old';staleBlock.blocker.plan_sha256='old';
 assert.equal(run(staleBlock).status,'IN_PROGRESS','obsolete blocker cannot end current revision');
 reject(e=>e.review.objective_checks[0].evidence_case_ids=['normal-320'],'goal must be contrasted in mobile and expanded');
 reject(e=>e.review.objective_checks=[],'review must address user objective');
 fs.appendFileSync(path.join(root,'component.html'),'<!-- revision changed -->');
 assert.equal(run(good).status,'IN_PROGRESS','changed source invalidates evidence');
 console.log('Delivery gate regressions passed: clipping, missing/stale evidence, reviewer and retest gates');
}finally{fs.rmSync(root,{recursive:true,force:true})}

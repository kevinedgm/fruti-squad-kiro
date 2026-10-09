const fs=require('node:fs'),path=require('node:path');
const {hash}=require('../.codex/qa/verify-delivery.cjs');
function plan(root,url){
 const p={version:1,artifact:'header',round:'r01',revision:'rev-01',stage:'F2',producer:'kiwi',inputs:[{path:'component.html',sha256:hash(path.join(root,'component.html'))}],profile_viewports:[390,768,1024,1440],variants:['A'],required_states:['normal','long-content'],cases:[]};
 for(const width of [320,375,390,768,1024,1440])p.cases.push({id:'normal-'+width,variant:'A',url,width,height:844,state:'normal',zoom:1,required:['h1','#action']});
 for(const width of [320,375])p.cases.push({id:'long-'+width,variant:'A',url:url+'?long=1',width,height:844,state:'long-content',zoom:1,required:['h1','#action']});
 p.cases.push({id:'zoom',variant:'A',url,width:320,height:844,state:'normal',zoom:2,required:['h1','#action']});
 p.cases.find(c=>c.id==='normal-320').task=true;
 p.cases.find(c=>c.id==='normal-320').actions=[{type:'click',selector:'#action'}];
 p.cases.find(c=>c.id==='normal-320').expected=[{selector:'#action',text:'Hecho'}];
 p.cases.find(c=>c.id==='normal-1440').task=true;
 p.cases.find(c=>c.id==='normal-1440').keyboard=true;
 p.cases.find(c=>c.id==='normal-1440').actions=[{type:'press',key:'Tab'},{type:'press',key:'Enter'}];
 p.cases.find(c=>c.id==='normal-1440').expected=[{selector:'#action',text:'Hecho'}];
 for(const c of p.cases.filter(c=>c.state==='long-content'))c.expected=[{selector:'h1',textIncludes:'extraordinariamente'}];
 fs.writeFileSync(path.join(root,'plan.json'),JSON.stringify(p));return p;
}
function review(e){e.review={role:'lima',status:'PASS',summary:'Synthetic gate fixture, not real visual review',plan_sha256:e.plan_sha256,traces_reviewed:e.runs.filter(r=>r.trace).map(r=>r.trace.path),screenshots_reviewed:e.runs.flatMap(r=>(r.screenshots||[]).map(s=>s.path)),dimensions:{structural:'PASS',visual:'PASS',accessibility:'PASS'},findings:[]};return e}
module.exports={plan,review};

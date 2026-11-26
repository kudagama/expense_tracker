export function financialInsights(data,previous,month,now=new Date()){
 const sum=rows=>(rows||[]).reduce((s,r)=>s+Number(r.amount||0),0);
 const income=Number(data.salary||0)+sum(data.incomes),spent=sum(data.expenses),saved=sum(data.savings),remaining=income-spent-saved;
 const [y,m]=month.split('-').map(Number),start=Date.UTC(y,m-1,23),end=Date.UTC(y,m,23),today=Date.parse(new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)+'T00:00:00Z');
 const duration=(end-start)/86400000,elapsed=Math.max(0,Math.min(duration,Math.floor((today-start)/86400000)+1)),left=duration-elapsed;
 const pace=elapsed>0?spent/elapsed:0,forecast=remaining-pace*left;
 const categories=rows=>{const out={};for(const e of rows||[]){const k=String(e.description||'Other').split(' · ')[0].trim().toLowerCase();out[k]=(out[k]||0)+Number(e.amount||0);}return out;};
 const current=categories(data.expenses),prior=categories(previous?.expenses),changes=Object.entries(current).filter(([k])=>prior[k]>0).map(([name,value])=>({name,value,percent:(value/prior[name]-1)*100})).filter(x=>x.percent>=20).sort((a,b)=>b.value-a.value).slice(0,3);
 const rate=income>0?saved/income:null;
 const score=income>0?Math.round(50*Math.max(0,Math.min(1,remaining/income+0.5))+50*Math.max(0,Math.min(1,saved/income/0.2))):null;
 return {income,spent,saved,remaining,elapsed,left,pace,forecast,changes,rate,score,active:today>=start&&today<end,previousSpent:previous?sum(previous.expenses):null};
}
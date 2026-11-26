'use client';
import {useEffect,useState} from 'react';
import styles from './BudgetPlanner.module.css';
export default function NotificationCenter({data,selectedMonth}){
 const [open,O]=useState(false),[remote,R]=useState(null),[read,S]=useState([]),[prefs,P]=useState({bills:true,budget:true,goals:true,salary:true,summary:true});
 useEffect(()=>{let alive=true;Promise.all(['/api/recurring','/api/goals'].map(async url=>{try{const r=await fetch(url,{cache:'no-store'});return r.ok?await r.json():null;}catch{return null;}})).then(([bills,goals])=>{if(alive)R({bills,goals});});return()=>{alive=false;};},[data,open]);
 if(!data||data.month!==selectedMonth)return null;
 const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const [y,m]=selectedMonth.split('-').map(Number),end=new Date(Date.UTC(y,m,22)).toISOString().slice(0,10),start=selectedMonth+'-23';
 const daysUntil=d=>Math.round((Date.parse(d)-Date.parse(today))/86400000);
 const alerts=[];const add=(type,id,title,message)=>{if(prefs[type])alerts.push({id:selectedMonth+':'+id,title,message});};
 if(today>=start&&today<=end){
 for(const b of remote?.bills||[]){if(b.paidMonths?.includes(selectedMonth))continue;const d=new Date(Date.UTC(y,m-1+(b.day<23?1:0),1));d.setUTCDate(Math.min(b.day,new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate()));const due=d.toISOString().slice(0,10),days=daysUntil(due);if(days<=3)add('bills','bill:'+b._id+':'+due,b.name,days<0?'Overdue since '+due:days===0?'Due today':'Due in '+days+' day(s)');}
 if(daysUntil(end)<=3)add('salary','cycle-end','Salary cycle ending','Current cycle ends '+end+'. Confirm your next salary separately.');
 const spent=(data.expenses||[]).reduce((s,e)=>s+Number(e.amount||0),0);add('summary','summary:'+today,'Cycle spending summary','Recorded expenses: Rs. '+spent.toLocaleString('en-LK'));
 }
 const totals=new Map();for(const e of data.expenses||[]){const k=String(e.description||'').split(' · ')[0].trim().toLowerCase();totals.set(k,(totals.get(k)||0)+Number(e.amount||0));}
 for(const [k,v] of Object.entries(data.budgetPlan?.limits||{})){const n=totals.get(k.toLowerCase())||0;if(Number(v)>0&&n/Number(v)>=.9)add('budget','budget:'+k+':'+(n>=v?'over':'near'),k+' budget',Math.round(n/Number(v)*100)+'% of recorded category budget used');}
 for(const g of remote?.goals||[]){const pct=g.target>0?Math.floor(g.allocated/g.target*100):0;if(pct>=25){const milestone=Math.min(100,Math.floor(pct/25)*25);add('goals','goal:'+g._id+':'+milestone,g.name,milestone+'% savings milestone reached');}}
 const unread=alerts.filter(a=>!read.includes(a.id)).length;
 return <section className={styles.root}><button type="button" aria-expanded={open} onClick={()=>O(!open)}>🔔 Notifications ({unread} unread)</button>{open&&<div><h2>Notification center</h2><p>In-app alerts for the selected cycle. Read status and preferences reset when the page reloads.</p><button onClick={()=>S(old=>[...new Set([...old,...alerts.map(a=>a.id)])])}>Mark all as read</button>{alerts.map(a=><div key={a.id} className={styles.bill}><div><strong>{read.includes(a.id)?'':'● '}{a.title}</strong><small>{a.message}</small></div><button onClick={()=>S(old=>[...new Set([...old,a.id])])}>Mark read</button></div>)}{!alerts.length&&<p>No alerts for this cycle.</p>}{(!remote?.bills||!remote?.goals)&&<p>Bill or goal alerts may be unavailable.</p>}<h3>Preferences</h3>{Object.keys(prefs).map(k=><label key={k}><input type="checkbox" checked={prefs[k]} onChange={e=>P(p=>({...p,[k]:e.target.checked}))}/>{k}</label>)}</div>}</section>;
}

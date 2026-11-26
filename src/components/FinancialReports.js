'use client';
import {useEffect,useState} from 'react';
import styles from './FinancialReports.module.css';
const sum=a=>(a||[]).reduce((s,x)=>s+Number(x.amount||0),0);
const money=n=>'Rs. '+n.toLocaleString('en-LK',{maximumFractionDigits:2});
const groups=[['Food & drinks',/food|lunch|dinner|breakfast|coffee|tea|rice|meal|kottu/i],['Transport',/fuel|petrol|bus|train|taxi|uber|pickme|transport/i],['Shopping',/shop|grocery|supermarket|clothes/i],['Bills',/bill|rent|internet|electricity|water|subscription/i],['Health',/doctor|medicine|hospital/i],['Entertainment',/movie|game|cinema|netflix/i],['Other',/$^/]];
const category=d=>groups.find(([k])=>k===String(d).split(' · ')[0])?.[0]||groups.find(([,r])=>r.test(d))?.[0]||'Other';
const day=d=>new Date(d).toLocaleDateString('en-CA',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'});
const csvCell=v=>'"'+String(v??'').replace(/^[\s]*[=+@-]/,"'$&").replace(/"/g,'""')+'"';
export default function FinancialReports({data,selectedMonth}){
 const [previous,P]=useState(null),[status,S]=useState('loading'),[mode,M]=useState('weekly');
 const [y,m]=selectedMonth.split('-').map(Number);
 const prior=new Date(Date.UTC(y,m-2,1)).toISOString().slice(0,7);
 useEffect(()=>{const c=new AbortController();P(null);S('loading');fetch('/api/reports?month='+prior,{signal:c.signal,cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(v=>{P(v);S('ready')}).catch(e=>{if(e.name!=='AbortError')S('error')});return()=>c.abort();},[prior]);
 if(!data||data.month!==selectedMonth)return null;
 const expenses=data.expenses||[],income=Number(data.salary||0)+sum(data.incomes),spent=sum(expenses),saved=sum(data.savings),remaining=income-spent-saved;
 const start=Date.UTC(y,m-1,23),end=Date.UTC(y,m,22),count=Math.round((end-start)/86400000)+1;
 const dates=Array.from({length:count},(_,i)=>new Date(start+i*86400000).toISOString().slice(0,10));
 const daily=dates.map(d=>({label:d.slice(5),value:sum(expenses.filter(e=>day(e.date)===d))}));
 const weekly=Array.from({length:Math.ceil(count/7)},(_,i)=>({label:'Week '+(i+1),value:daily.slice(i*7,i*7+7).reduce((s,x)=>s+x.value,0)}));
 const bars=mode==='daily'?daily:weekly,max=Math.max(1,...bars.map(x=>x.value));
 const categories=groups.map(([label])=>({label,value:sum(expenses.filter(e=>category(e.description)===label))})).sort((a,b)=>b.value-a.value);
 const old=previous?sum(previous.expenses):null;
 function download(){const rows=[['Cycle',selectedMonth],['Income',income],['Expenses',spent],['Savings',saved],['Remaining',remaining],[],['Date','Category','Description','Wallet','Amount'],...expenses.map(e=>[day(e.date),category(e.description),e.description,e.wallet||'unassigned',e.amount])];const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='finance-'+selectedMonth+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <section className={styles.root}><header><div><h2>Financial reports</h2><p>{dates[0]} – {dates[count-1]} · LKR</p></div><div className={styles.actions}><button onClick={download}>Export CSV</button><button onClick={()=>window.print()}>Print / Save PDF</button></div></header><div className={styles.cards}>{[['Income',income],['Expenses',spent],['Savings',saved],['Remaining',remaining]].map(([k,v])=><div key={k}><small>{k}</small><strong>{money(v)}</strong></div>)}</div><p>Savings rate: {income>0?(saved/income*100).toFixed(1)+'%':'Not available'} · {remaining<0?'Recorded spending and savings exceed income':'Recorded spending and savings are within income'}</p><h3>Spending trend</h3><div className={styles.actions}>{['daily','weekly'].map(k=><button key={k} aria-pressed={mode===k} onClick={()=>M(k)}>{k}</button>)}</div><div className={styles.chart}>{bars.map(b=><div key={b.label}><span>{b.label}</span><div className={styles.track}><i style={{width:Math.max(0,b.value/max*100)+'%'}}/></div><b>{money(b.value)}</b></div>)}</div><h3>Category breakdown</h3><div className={styles.chart}>{categories.map(b=><div key={b.label}><span>{b.label}</span><div className={styles.track}><i style={{width:Math.max(0,spent?b.value/spent*100:0)+'%'}}/></div><b>{money(b.value)}</b></div>)}</div><h3>Previous salary cycle</h3><p>{status==='loading'?'Loading comparison…':status==='error'?'Comparison unavailable':old===null?'No recorded previous cycle':money(old)+' previous · '+money(spent)+' current · '+(old>0?((spent-old)/old*100).toFixed(1)+'% change':'Percentage change unavailable')}</p><small>Reports use recorded values, including estimated categories for older expenses. Savings rate is not a credit score. Partial cycles are compared as recorded.</small></section>;
}

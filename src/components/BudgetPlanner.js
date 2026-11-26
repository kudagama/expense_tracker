'use client';
import {useState,useEffect} from 'react';
import styles from './BudgetPlanner.module.css';
const groups=[['Food & drinks',/food|lunch|dinner|breakfast|tea|coffee|rice|kottu|meal|snack|restaurant/i],['Transport',/fuel|petrol|diesel|bus|train|taxi|uber|pickme|transport|tuk/i],['Shopping',/shop|grocery|supermarket|shirt|dress|clothes/i],['Bills',/bill|rent|internet|mobile|reload|electricity|water|subscription/i],['Health',/doctor|medicine|hospital|pharmacy/i],['Entertainment',/movie|game|cinema|netflix|party/i],['Other',/$^/]];
const category=d=>groups.find(([k])=>k===String(d).split(' · ')[0])?.[0]||groups.find(([,r])=>r.test(d))?.[0]||'Other';
const money=n=>'Rs. '+Number(n||0).toLocaleString('en-LK',{maximumFractionDigits:2});
const sum=a=>(a||[]).reduce((s,x)=>s+Number(x.amount||0),0);
const dateKey=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
export default function BudgetPlanner({data,selectedMonth}){
 const [plan,setPlan]=useState({dailyLimit:0,limits:{},bills:[]});
 const [name,setName]=useState(''),[amount,setAmount]=useState(''),[due,setDue]=useState('');
 const [busy,setBusy]=useState(false),[status,setStatus]=useState('');
 useEffect(()=>{setPlan({dailyLimit:data?.budgetPlan?.dailyLimit||0,limits:data?.budgetPlan?.limits||{},bills:data?.budgetPlan?.bills||[]});setStatus('');},[data,selectedMonth]);
 const [y,m]=selectedMonth.split('-').map(Number),now=new Date(),start=new Date(y,m-1,23),end=new Date(y,m,22);
 const current=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 const days=current>end?0:Math.round((end-Math.max(start,current))/86400000)+1;
 const expenses=data?.expenses||[];
 const available=Number(data?.salary||0)+sum(data?.incomes)-sum(expenses)-sum(data?.savings);
 const pending=sum(plan.bills.filter(b=>!b.paid));
 const free=available-pending;
 const daily=days?Math.max(0,free)/days:0;
 const target=Number(plan.dailyLimit)>0?Math.min(daily,Number(plan.dailyLimit)):daily;
 const todaySpent=sum(expenses.filter(e=>dateKey(new Date(e.date))===dateKey(now)));
 const forecast=free-target*days;
 const setLimit=(k,v)=>setPlan(p=>({...p,limits:{...p.limits,[k]:v}}));
 const changeBill=(i,patch)=>setPlan(p=>({...p,bills:p.bills.map((b,j)=>j===i?{...b,...patch}:b)}));
 async function save(){setBusy(true);setStatus('');try{const payload={dailyLimit:Number(plan.dailyLimit),limits:Object.fromEntries(groups.map(([k])=>[k,Number(plan.limits[k]||0)])),bills:plan.bills};const r=await fetch('/api/budget',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({month:selectedMonth,plan:payload})});if(!r.ok)throw Error();setStatus('Budget saved.');}catch{setStatus('Unable to save budget. Please retry.');}finally{setBusy(false);}}
 function addBill(e){e.preventDefault();if(!name.trim()||!Number.isFinite(Number(amount))||Number(amount)<=0||due<dateKey(start)||due>dateKey(end))return;setPlan(p=>({...p,bills:[...p.bills,{name:name.trim(),amount:Number(amount),dueDate:due,paid:false}]}));setName('');setAmount('');setDue('');}
 return <section className={styles.root}><header><h2>Smart budget planner</h2><p>Plan your salary cycle before spending. Save changes to keep your plan.</p></header>
 <div className={styles.cards}>{[['Unpaid bills',pending],['Safe daily allowance',target],['Projected cycle balance',forecast]].map(([k,v])=><div key={k}><small>{k}</small><strong>{money(v)}</strong></div>)}</div>
 {free<0&&<p className={styles.warning}>Your planned bills exceed available funds by {money(-free)}.</p>}
 <div className={styles.columns}><div><h3>Daily spending limit</h3><label>Daily limit (0 = automatic)<input type="number" min="0" max="1000000000" value={plan.dailyLimit} onChange={e=>setPlan(p=>({...p,dailyLimit:e.target.value}))}/></label><p>Spent today: {money(todaySpent)} · {days} days left</p>{days>0&&todaySpent>target&&<p className={styles.warning}>Today's spending exceeds the current daily allowance.</p>}
 <h3>Category budgets</h3>{groups.map(([k])=>{const spent=sum(expenses.filter(e=>category(e.description)===k)),limit=Number(plan.limits[k]||0);return <div key={k} className={styles.category}><label>{k}<input aria-label={k+' budget'} type="number" min="0" max="1000000000" placeholder="No limit" value={plan.limits[k]??''} onChange={e=>setLimit(k,e.target.value)}/></label><small>{money(spent)} spent {limit>0?' / '+money(limit):''}</small>{limit>0&&<><progress max={limit} value={Math.min(spent,limit)}/>{spent>=limit*.8&&<small className={styles.warning}>{spent>limit?'Over budget':'At least 80% used'}</small>}</>}</div>})}</div>
 <div><h3>Upcoming bills</h3><p>Plan bills for this cycle. Mark paid only after recording the actual expense.</p><form onSubmit={addBill}><label>Bill name<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Internet, loan, rent…"/></label><label>Amount<input required type="number" min=".01" step=".01" max="1000000000" value={amount} onChange={e=>setAmount(e.target.value)}/></label><label>Due date<input required type="date" min={dateKey(start)} max={dateKey(end)} value={due} onChange={e=>setDue(e.target.value)}/></label><button type="submit">+ Plan bill</button></form>
 {plan.bills.map((b,i)=><div className={styles.bill} key={i}><div><strong>{b.name}</strong><small>{b.dueDate} · {money(b.amount)}</small></div><label><input type="checkbox" checked={b.paid} onChange={e=>changeBill(i,{paid:e.target.checked})}/> Paid</label><button type="button" aria-label={'Remove '+b.name} onClick={()=>setPlan(p=>({...p,bills:p.bills.filter((_,j)=>j!==i)}))}>×</button></div>)}</div></div>
 <button type="button" disabled={busy||!data||data.month!==selectedMonth} onClick={save}>{busy?'Saving…':'Save budget plan'}</button><p role="status">{status}</p><small>Forecast assumes spending at the displayed daily allowance and payment of all unpaid planned bills. It is an estimate, not a bank balance.</small></section>;
}

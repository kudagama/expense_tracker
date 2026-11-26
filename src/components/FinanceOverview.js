'use client';
import { useMemo, useState } from 'react';
import styles from './FinanceOverview.module.css';

const GROUPS = [
  { label:'Food & drinks', icon:'🍽️', color:'#f59e0b', keys:['food','lunch','dinner','breakfast','tea','coffee','rice','kottu','meal','snack','restaurant'] },
  { label:'Transport', icon:'🚕', color:'#3b82f6', keys:['fuel','petrol','diesel','bus','train','taxi','uber','pickme','transport','tuk'] },
  { label:'Shopping', icon:'🛍️', color:'#a78bfa', keys:['shopping','shirt','dress','clothes','grocery','supermarket','shop'] },
  { label:'Bills', icon:'💡', color:'#14b8a6', keys:['bill','rent','internet','mobile','reload','electricity','water','subscription'] },
  { label:'Health', icon:'💊', color:'#f472b6', keys:['doctor','medicine','hospital','pharmacy'] },
  { label:'Other', icon:'🧾', color:'#94a3b8', keys:[] }
];
const cash = value => 'Rs. '+Number(value || 0).toLocaleString('en-LK',{maximumFractionDigits:2});
const groupFor = description => GROUPS.find(g => g.keys.some(k => String(description).toLowerCase().includes(k))) || GROUPS[GROUPS.length-1];
const localKey = date => {const d = new Date(date);return Number.isNaN(d.getTime())?'':[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};

export default function FinanceOverview({data,selectedMonth,addExpense}) {
 const [amount,setAmount]=useState('');
 const [description,setDescription]=useState('');
 const [busy,setBusy]=useState(false);
 const [query,setQuery]=useState('');
 const expenses=useMemo(()=>data?.expenses||[],[data]);
 const income=(data?.incomes||[]).reduce((s,x)=>s+Number(x.amount||0),0);
 const spent=expenses.reduce((s,x)=>s+Number(x.amount||0),0);
 const saved=(data?.savings||[]).reduce((s,x)=>s+Number(x.amount||0),0);
 const available=Number(data?.salary||0)+income-spent-saved;
 const [y,m]=selectedMonth.split('-').map(Number);
 const start=new Date(y,m-1,23);
 const end=new Date(y,m,22,23,59,59,999);
 const now=new Date();
 const daysLeft=now>end?0:Math.max(1,Math.ceil((end-(now<start?start:now))/86400000));
 const dailyBudget=daysLeft?Math.max(0,available)/daysLeft:0;
 const today=localKey(now);
 const todaySpend=expenses.filter(x=>localKey(x.date)===today).reduce((s,x)=>s+Number(x.amount||0),0);
 const categories=GROUPS.map(g=>({...g,total:expenses.filter(e=>groupFor(e.description).label===g.label).reduce((s,e)=>s+Number(e.amount||0),0)})).filter(g=>g.total>0).sort((a,b)=>b.total-a.total);
 const recent=expenses.filter(e=>e.description.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
 const save=async(e)=>{e.preventDefault();if(busy||!Number.isFinite(Number(amount))||Number(amount)<=0||!description.trim())return;setBusy(true);try{const ok=await addExpense(Number(amount),description.trim(),new Date().toISOString());if(ok){setAmount('');setDescription('');}}finally{setBusy(false);}};
 return <section className={styles.overview} aria-label="Finance overview">
  <div className={styles.heading}><div><p className={styles.kicker}>YOUR FINANCIAL SNAPSHOT</p><h2>Make every rupee count ✨</h2><p>Track today, understand your spending, and stay on budget.</p></div><span className={styles.cycle}>{start.toLocaleDateString('en-LK',{day:'numeric',month:'short'})} – {end.toLocaleDateString('en-LK',{day:'numeric',month:'short',year:'numeric'})}</span></div>
  <div className={styles.cards}>
   <div className={styles.balance}><span>AVAILABLE TO SPEND</span><strong>{cash(available)}</strong><small>Income − expenses − savings</small></div>
   <div className={styles.card}><span>↗ SPENT THIS CYCLE</span><strong>{cash(spent)}</strong><small>{expenses.length} recorded expenses</small></div>
   <div className={styles.card}><span>◷ SPENT TODAY</span><strong>{cash(todaySpend)}</strong><small>{daysLeft} days left in cycle</small></div>
   <div className={styles.card}><span>✦ DAILY GUIDE</span><strong>{cash(dailyBudget)}</strong><small>Suggested amount per day</small></div>
  </div>
  <div className={styles.columns}>
   <div className={styles.panel}><h3>Where your money goes</h3><p>Estimated categories based on expense descriptions</p>{categories.length?categories.map(g=><div className={styles.category} key={g.label}><span>{g.icon} {g.label}</span><strong>{cash(g.total)}</strong><div className={styles.bar}><div style={{width:(g.total/spent*100)+'%',background:g.color}}/></div></div>):<div className={styles.empty}>Your spending breakdown appears after your first expense.</div>}</div>
   <div className={styles.panel}><h3>Quick add expense</h3><p>Log your next purchase without hunting for a form</p><form className={styles.quickForm} onSubmit={save}><label>Amount (LKR)<input type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g. 450" required/></label><label>What was it for?<input value={description} maxLength="150" onChange={e=>setDescription(e.target.value)} placeholder="e.g. Lunch" required/></label><button disabled={busy} type="submit">{busy?'Adding…':'+ Add expense'}</button></form><div className={styles.budget}><span>Today vs daily guide</span><strong>{cash(todaySpend)} / {cash(dailyBudget)}</strong><div className={styles.bar}><div style={{width:(dailyBudget>0?Math.min(100,todaySpend/dailyBudget*100):todaySpend>0?100:0)+'%',background:todaySpend>dailyBudget?'#ef4444':'#8b5cf6'}}/></div></div></div>
  </div>
  <div className={styles.panel}><div className={styles.activityHead}><div><h3>Recent expenses</h3><p>Your latest recorded purchases</p></div><input aria-label="Search recent expenses" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search expenses…"/></div>{recent.length?recent.map(e=><div className={styles.item} key={e._id}><span className={styles.itemIcon}>{groupFor(e.description).icon}</span><span className={styles.itemText}><strong>{e.description}</strong><small>{new Date(e.date).toLocaleDateString('en-LK',{day:'numeric',month:'short',year:'numeric'})} · {groupFor(e.description).label}</small></span><b>− {cash(e.amount)}</b></div>):<div className={styles.empty}>No expenses found for this cycle.</div>}</div>
 </section>;
}

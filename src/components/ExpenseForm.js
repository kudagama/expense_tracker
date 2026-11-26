import React, { useState, useRef } from 'react';
import styles from './ExpenseForm.module.css';

const categories = [['🍔','Food & drinks','Lunch'],['🚕','Transport','Fuel'],['🛍️','Shopping','Groceries'],['💡','Bills','Internet bill'],['💊','Health','Medicine'],['🎮','Entertainment','Movie'],['🧾','Other','Other expense']];
const today = () => { const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); };

export default function ExpenseForm({addExpense, expenses=[], onSaved}) {
 const ranked=[...categories].sort((a,b)=>expenses.filter(e=>String(e.description).split(' · ')[0]===b[1]).length-expenses.filter(e=>String(e.description).split(' · ')[0]===a[1]).length);
 const suggestions=[...new Set([...expenses].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>String(e.description||'')).filter(x=>categories.some(c=>x.startsWith(c[1]+' · '))))].slice(0,5);
 const [amount,setAmount]=useState('');
 const [category,setCategory]=useState('');
 const [note,setNote]=useState('');
 const [date,setDate]=useState(today);
 const [busy,setBusy]=useState(false);
 const [keypad,setKeypad]=useState(false);
 const [error,setError]=useState('');
 const lock=useRef(false);
 const amountRef=useRef(null);
 async function save(e){
  e.preventDefault();
  if(lock.current)return;
  const value=Number(amount);
  if(!Number.isFinite(value)||value<=0||!category||!date||date>today()){setError('Enter a positive amount, select a category and a valid date.');return;}
  const [y,m,d]=date.split('-').map(Number), now=new Date();
  const when=new Date(y,m-1,d,now.getHours(),now.getMinutes(),now.getSeconds());
  lock.current=true;setBusy(true);setError('');
  try{
   const description=category+(note.trim()?' · '+note.trim():'');
   if(await addExpense(value,description,when.toISOString())){setAmount('');setNote('');setCategory('');setDate(today());onSaved?.();}
   else setError('Could not save. Your entry is still here; please try again.');
  }catch{setError('Could not save. Please try again.');}
  finally{lock.current=false;setBusy(false);}
 }
 return <section className={styles.formSection}>
  <h2>Add expense</h2><p className={styles.subtitle}>Log a purchase in seconds.</p>
  <form onSubmit={save}>
   <label className={styles.fieldLabel} htmlFor="expense-amount">Amount</label>
   <div className={styles.amountBox}><span>Rs.</span><input id="expense-amount" ref={amountRef} type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} required/></div>
   <button type="button" className={styles.keyToggle} aria-expanded={keypad} onClick={()=>setKeypad(v=>!v)}>{keypad?'Hide keypad':'Show numeric keypad'}</button>
   {keypad&&<div className={styles.keypad}>{['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k=><button type="button" key={k} onClick={()=>setAmount(v=>{if(k==='⌫')return v.slice(0,-1);const next=v+k;return /^\d{0,9}(\.\d{0,2})?$/.test(next)?next:v;})}>{k}</button>)}</div>}
   <div className={styles.presets}>{[100,250,500,1000].map(n=><button key={n} type="button" onClick={()=>setAmount(String(n))}>Rs. {n.toLocaleString()}</button>)}</div>
   <fieldset className={styles.categories}><legend>Category</legend><div className={styles.categoryGrid}>{ranked.map(([icon,label])=><button type="button" key={label} aria-pressed={category===label} className={category===label?styles.selected:''} onClick={()=>setCategory(label)}><span>{icon}</span>{label}</button>)}</div></fieldset>
   {suggestions.length>0&&<div className={styles.suggestions}><label>Recent purchases</label><div className={styles.presets}>{suggestions.map(x=><button type="button" key={x} onClick={()=>{const i=x.indexOf(' · ');setCategory(x.slice(0,i));setNote(x.slice(i+3));}}>{x.split(' · ').slice(1).join(' · ')}</button>)}</div></div>}
   <div className={styles.formGroup}><label htmlFor="expense-note">Note (optional)</label><input id="expense-note" className={styles.input} maxLength={150} value={note} onChange={e=>setNote(e.target.value)} placeholder={categories.find(c=>c[1]===category)?.[2]||'What did you buy?'}/></div>
   <div className={styles.formGroup}><label htmlFor="expense-date">Date</label><input id="expense-date" type="date" className={styles.input} value={date} max={today()} onChange={e=>setDate(e.target.value)} required/></div>
   {error&&<p role="alert" className={styles.error}>{error}</p>}
   <button type="submit" className={styles.button} disabled={busy}>{busy?'Saving…':'+ Save expense'}</button>
  </form>
 </section>;
}

import React, { useState, useRef } from 'react';
import styles from './ExpenseForm.module.css';

const categories = [['🍔','Food & drinks','Lunch'],['🚕','Transport','Fuel'],['🛍️','Shopping','Groceries'],['💡','Bills','Internet bill'],['💊','Health','Medicine'],['🎮','Entertainment','Movie'],['🧾','Other','Other expense']];
const today = () => { const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); };

export default function ExpenseForm({addExpense}) {
 const [amount,setAmount]=useState('');
 const [category,setCategory]=useState('');
 const [note,setNote]=useState('');
 const [date,setDate]=useState(today);
 const [busy,setBusy]=useState(false);
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
   if(await addExpense(value,description,when.toISOString())){setAmount('');setNote('');setCategory('');setDate(today());amountRef.current?.focus();}
   else setError('Could not save. Your entry is still here; please try again.');
  }catch{setError('Could not save. Please try again.');}
  finally{lock.current=false;setBusy(false);}
 }
 return <section className={styles.formSection}>
  <h2>Add expense</h2><p className={styles.subtitle}>Log a purchase in seconds.</p>
  <form onSubmit={save}>
   <label className={styles.fieldLabel} htmlFor="expense-amount">Amount</label>
   <div className={styles.amountBox}><span>Rs.</span><input id="expense-amount" ref={amountRef} type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} required/></div>
   <div className={styles.presets}>{[100,250,500,1000].map(n=><button key={n} type="button" onClick={()=>setAmount(String(n))}>Rs. {n.toLocaleString()}</button>)}</div>
   <fieldset className={styles.categories}><legend>Category</legend><div className={styles.categoryGrid}>{categories.map(([icon,label])=><button type="button" key={label} aria-pressed={category===label} className={category===label?styles.selected:''} onClick={()=>setCategory(label)}><span>{icon}</span>{label}</button>)}</div></fieldset>
   <div className={styles.formGroup}><label htmlFor="expense-note">Note (optional)</label><input id="expense-note" className={styles.input} maxLength={150} value={note} onChange={e=>setNote(e.target.value)} placeholder={categories.find(c=>c[1]===category)?.[2]||'What did you buy?'}/></div>
   <div className={styles.formGroup}><label htmlFor="expense-date">Date</label><input id="expense-date" type="date" className={styles.input} value={date} max={today()} onChange={e=>setDate(e.target.value)} required/></div>
   {error&&<p role="alert" className={styles.error}>{error}</p>}
   <button type="submit" className={styles.button} disabled={busy}>{busy?'Saving…':'+ Save expense'}</button>
  </form>
 </section>;
}

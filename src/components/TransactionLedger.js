'use client';
import {useState} from 'react';
import styles from './FinancialReports.module.css';
export default function TransactionLedger({data,selectedMonth}){
 const [filter,F]=useState('all'),[query,Q]=useState('');
 if(!data||data.month!==selectedMonth)return null;
 const withdrawals=data.withdrawals||[];
 const rows=[
 ...(data.salary?[{id:'salary',type:'Salary',description:'Monthly salary',amount:data.salary,date:data.salaryDate||'',wallet:'Unassigned'}]:[]),
 ...['incomes','expenses','savings'].flatMap(k=>(data[k]||[]).map(e=>({id:k+e._id,type:({incomes:'Income',expenses:'Expense',savings:'Savings'})[k],description:e.description,amount:k==='savings'?Number(e.amount)+withdrawals.filter(w=>String(w.savingsId)===String(e._id)).reduce((s,w)=>s+Number(w.amount),0):Number(e.amount),date:e.date,wallet:e.wallet||'Unassigned'}))),
 ...withdrawals.map((w,i)=>({id:'withdraw'+(w.requestId||i),type:'Withdrawal',description:'Savings released',amount:w.amount,date:w.date,wallet:'Unassigned'})),
 ...(data.walletPlan?.transfers||[]).map((t,i)=>({id:'transfer'+i,type:'Transfer',description:t.from+' → '+t.to,amount:t.amount,date:t.date||'',wallet:t.from+' → '+t.to}))
 ].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0));
 const visible=rows.filter(r=>(filter==='all'||r.type===filter)&&[r.description,r.wallet,r.type].join(' ').toLowerCase().includes(query.toLowerCase()));
 return <section className={styles.root}><h2>Transaction ledger</h2><p>All recorded activity for {selectedMonth}. Internal transfers are not new income. Undated records are shown last.</p><div className={styles.actions}><select aria-label="Transaction type" value={filter} onChange={e=>F(e.target.value)}>{['all','Salary','Income','Expense','Savings','Withdrawal','Transfer'].map(k=><option key={k}>{k}</option>)}</select><input aria-label="Search ledger" placeholder="Search transactions" value={query} onChange={e=>Q(e.target.value)}/></div><div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',textAlign:'left',fontSize:13}}><thead><tr>{['Date','Type','Description','Wallet','LKR'].map(k=><th key={k} style={{padding:10}}>{k}</th>)}</tr></thead><tbody>{visible.map(r=><tr key={r.id} style={{borderTop:'1px solid #ffffff18'}}><td style={{padding:10}}>{r.date&&Number.isFinite(Date.parse(r.date))?new Date(r.date).toLocaleDateString('en-LK',{timeZone:'Asia/Colombo'}):'Not recorded'}</td><td>{r.type}</td><td>{r.description}</td><td>{r.wallet}</td><td>{Number(r.amount).toLocaleString('en-LK',{maximumFractionDigits:2})}</td></tr>)}</tbody></table></div>{!visible.length&&<p>No matching transactions.</p>}<small>Historical withdrawals may appear as legacy income and savings records. This view does not change balances or migrate records.</small></section>;
}

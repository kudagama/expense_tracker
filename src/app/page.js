'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import styles from './page.module.css';
import { useExpenses } from '../hooks/useExpenses';
import Header from '../components/Header';
import FinanceOverview from '../components/FinanceOverview';
import BudgetPlanner from '../components/BudgetPlanner';
import WalletPlanner from '../components/WalletPlanner';
import FinancialReports from '../components/FinancialReports';
import SummaryCards from '../components/SummaryCards';
import ExpenseList from '../components/ExpenseList';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import SavingsForm from '../components/SavingsForm';
import SavingsList from '../components/SavingsList';

const sections=[['home','Dashboard','⌂'],['wallets','Wallets','▣'],['transactions','Transactions','⇄'],['budget','Budget','◎'],['reports','Reports','▥']];
export default function Home() {
  const [section,setSection]=useState('home');
  const navigate=(id)=>{setSection(id);window.scrollTo({top:0,behavior:'instant'});};
  const {
    data,
    loading,
    selectedMonth,
    setSelectedMonth,
    updateSalary,
    addExpense,
    deleteExpense,
    updateExpense,
    addIncome,
    deleteIncome,
    updateIncome,
    addSavings,
    deleteSavings,
    updateSavings,
    transferSavingsToWallet
  } = useExpenses();

  if (loading && !data) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading your expenses...</div>
      </main>
    );
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}><div className={styles.brand}><span>◈</span><div>Pocketwise<small>PERSONAL FINANCE</small></div></div><nav aria-label="Main navigation">{sections.map(([id,label,icon])=><button key={id} type="button" aria-current={section===id?'page':undefined} onClick={()=>navigate(id)}><span aria-hidden="true">{icon}</span>{label}</button>)}</nav><Link className={styles.profile} href="/profile">⚙ Account settings</Link></aside>
      <main className={styles.container}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
      }} />
      
      <Header 
        selectedMonth={selectedMonth} 
        setSelectedMonth={setSelectedMonth} 
      />

      <div className={styles.pageTitle}><div><p>YOUR MONEY, YOUR FUTURE</p><h2>{sections.find(x=>x[0]===section)?.[1]}</h2></div>{loading&&<small role="status">Refreshing…</small>}</div>
      <div hidden={section!=='home'}><FinanceOverview data={data?.month===selectedMonth?data:null} selectedMonth={selectedMonth} addExpense={addExpense} />
      <div className={styles.shortcuts}>{[['transactions','⇄','Income & savings'],['wallets','▣','Manage wallets'],['budget','◎','Plan budget'],['reports','▥','View reports']].map(([id,icon,label])=><button key={id} onClick={()=>navigate(id)}><span>{icon}</span>{label}</button>)}</div></div>

      <div hidden={section!=='wallets'}><WalletPlanner key={'wallet-'+selectedMonth} data={data?.month===selectedMonth?data:null} selectedMonth={selectedMonth} /></div>
      <div hidden={section!=='budget'}><BudgetPlanner key={selectedMonth} data={data?.month===selectedMonth?data:null} selectedMonth={selectedMonth} /></div>

      {section==='reports'&&<FinancialReports data={data} selectedMonth={selectedMonth} />}
      <div hidden={section!=='transactions'}>

      <SummaryCards 
        data={data} 
        updateSalary={updateSalary}
        selectedMonth={selectedMonth}
        addSavings={addSavings}
        addIncome={addIncome}
      />

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <IncomeForm addIncome={addIncome} />
          <SavingsForm addSavings={addSavings} />
        </div>
        
        <div className={styles.rightColumn}>
          <IncomeList 
            incomes={data?.incomes} 
            deleteIncome={deleteIncome}
            updateIncome={updateIncome}
          />
          <SavingsList
            savings={data?.savings}
            deleteSavings={deleteSavings}
            updateSavings={updateSavings}
            transferSavingsToWallet={transferSavingsToWallet}
          />
          <ExpenseList 
            expenses={data?.expenses} 
            deleteExpense={deleteExpense}
            updateExpense={updateExpense}
          />
        </div>
      </div>
      </div>
    </main>
    <nav className={styles.bottomNav} aria-label="Mobile navigation">{sections.map(([id,label,icon])=><button key={id} type="button" aria-current={section===id?'page':undefined} onClick={()=>navigate(id)}><span aria-hidden="true">{icon}</span><small>{label}</small></button>)}</nav>
    </div>
  );
}

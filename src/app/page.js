'use client';

import { Toaster } from 'react-hot-toast';
import styles from './page.module.css';
import { useExpenses } from '../hooks/useExpenses';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';

export default function Home() {
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
    updateIncome
  } = useExpenses();

  if (loading && !data) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading your expenses...</div>
      </main>
    );
  }

  return (
    <main className={`${styles.container} animate-fade-in`}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
      }} />
      
      <Header 
        selectedMonth={selectedMonth} 
        setSelectedMonth={setSelectedMonth} 
      />

      <SummaryCards 
        data={data} 
        updateSalary={updateSalary}
        selectedMonth={selectedMonth}
      />

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <IncomeForm addIncome={addIncome} />
          <ExpenseForm addExpense={addExpense} />
        </div>
        
        <div className={styles.rightColumn}>
          <IncomeList 
            incomes={data?.incomes} 
            deleteIncome={deleteIncome}
            updateIncome={updateIncome}
          />
          <ExpenseList 
            expenses={data?.expenses} 
            deleteExpense={deleteExpense}
            updateExpense={updateExpense}
          />
        </div>
      </div>
    </main>
  );
}

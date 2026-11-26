'use client';

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
    <main className={`${styles.container} animate-fade-in`}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
      }} />
      
      <Header 
        selectedMonth={selectedMonth} 
        setSelectedMonth={setSelectedMonth} 
      />

      <FinanceOverview data={data} selectedMonth={selectedMonth} addExpense={addExpense} />

      <WalletPlanner key={'wallet-'+selectedMonth} data={data?.month===selectedMonth?data:null} selectedMonth={selectedMonth} />
      <BudgetPlanner key={selectedMonth} data={data?.month===selectedMonth?data:null} selectedMonth={selectedMonth} />

      <FinancialReports data={data} selectedMonth={selectedMonth} />

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
    </main>
  );
}

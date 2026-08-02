import React, { useState } from 'react';
import styles from './ExpenseList.module.css';
import ExpenseItem from './ExpenseItem';

const ITEMS_PER_PAGE = 10;

export default function ExpenseList({ expenses, deleteExpense, updateExpense }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!expenses || expenses.length === 0) {
    return (
      <section className={styles.expensesSection}>
        <h2>Recent Expenses</h2>
        <div className={styles.expenseList}>
          <p className={styles.emptyState}>No expenses recorded for this month yet.</p>
        </div>
      </section>
    );
  }

  // Sort by date descending (latest first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentExpenses = sortedExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className={styles.expensesSection}>
      <h2>Recent Expenses</h2>
      <div className={styles.expenseList}>
        {currentExpenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            deleteExpense={deleteExpense}
            updateExpense={updateExpense}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

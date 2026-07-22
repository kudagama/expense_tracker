import React from 'react';
import styles from './ExpenseList.module.css';
import ExpenseItem from './ExpenseItem';

export default function ExpenseList({ expenses, deleteExpense, updateExpense }) {
  return (
    <section className={styles.expensesSection}>
      <h2>Recent Expenses</h2>
      <div className={styles.expenseList}>
        {expenses?.length > 0 ? (
          expenses.slice().reverse().map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              deleteExpense={deleteExpense}
              updateExpense={updateExpense}
            />
          ))
        ) : (
          <p className={styles.emptyState}>No expenses recorded for this month yet.</p>
        )}
      </div>
    </section>
  );
}

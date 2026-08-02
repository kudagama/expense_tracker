import React from 'react';
import styles from './IncomeList.module.css';
import IncomeItem from './IncomeItem';

export default function IncomeList({ incomes, deleteIncome, updateIncome }) {
  return (
    <section className={styles.incomesSection}>
      <h2>Recent Incomes</h2>
      <div className={styles.incomeList}>
        {incomes?.length > 0 ? (
          incomes.slice().reverse().map((income) => (
            <IncomeItem
              key={income._id}
              income={income}
              deleteIncome={deleteIncome}
              updateIncome={updateIncome}
            />
          ))
        ) : (
          <p className={styles.emptyState}>No incomes recorded for this month yet.</p>
        )}
      </div>
    </section>
  );
}

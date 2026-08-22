import React, { useState, useEffect } from 'react';
import styles from './SummaryCards.module.css';

export default function SummaryCards({ data, updateSalary, selectedMonth }) {
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');
  const [salaryDateInput, setSalaryDateInput] = useState('');

  useEffect(() => {
    if (data) {
      setSalaryInput(data.salary || '');
      setSalaryDateInput(data.salaryDate || '');
    }
  }, [data]);

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    if (!salaryInput) return;
    const success = await updateSalary(salaryInput, salaryDateInput);
    if (success) {
      setIsEditingSalary(false);
    }
  };

  const salary = data?.salary || 0;
  const totalIncomes = data?.incomes?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalExpenses = data?.expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalSavings = data?.savings?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const remainingSalary = (salary + totalIncomes) - totalExpenses - totalSavings;

  // Calculate Daily Budget based on days remaining in the cycle
  let daysLeft = 1; // Default to 1 to avoid division by zero
  
  if (selectedMonth) {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const cycleYear = parseInt(yearStr, 10);
    const cycleMonth = parseInt(monthStr, 10) - 1; // 0-indexed

    // The cycle ends on the 22nd of the NEXT calendar month
    const cycleEndDate = new Date(cycleYear, cycleMonth + 1, 22);
    cycleEndDate.setHours(23, 59, 59, 999);
    
    const cycleStartDate = new Date(cycleYear, cycleMonth, 23);
    cycleStartDate.setHours(0, 0, 0, 0);

    const today = new Date();
    
    // Check if today is within or before this cycle
    if (today <= cycleEndDate) {
      // If we're looking at a future cycle or current cycle
      // Calculate from today (if in current cycle) or from start date (if future cycle)
      const startDateForCalc = today > cycleStartDate ? today : cycleStartDate;
      
      // Zero out the time for accurate day difference
      const startDay = new Date(startDateForCalc);
      startDay.setHours(0, 0, 0, 0);
      
      daysLeft = Math.ceil((cycleEndDate - startDay) / (1000 * 60 * 60 * 24));
    } else {
      // Past cycle - cycle has ended, use full total days
      daysLeft = Math.ceil((cycleEndDate - cycleStartDate) / (1000 * 60 * 60 * 24));
    }
  }

  if (daysLeft < 1) daysLeft = 1;

  const dailyLimit = remainingSalary / daysLeft;

  const expectedSalary = data?.expectedSalary || 0;
  const variance = salary - expectedSalary;
  
  let varianceClass = '';
  let varianceText = '';
  if (expectedSalary > 0) {
    if (variance > 0) {
      varianceClass = styles.variancePositive;
      varianceText = `+ Rs. ${variance.toLocaleString()} (Bonus)`;
    } else if (variance < 0) {
      varianceClass = styles.varianceNegative;
      varianceText = `- Rs. ${Math.abs(variance).toLocaleString()} (Shortfall)`;
    } else {
      varianceClass = styles.varianceNeutral;
      varianceText = `Matches expected`;
    }
  }

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <span>Actual Salary</span>
          {!isEditingSalary && (
            <button onClick={() => setIsEditingSalary(true)} className={styles.editBtn}>✏️</button>
          )}
        </div>
        {isEditingSalary ? (
          <form onSubmit={handleUpdateSalary} className={styles.form}>
            <input
              type="number"
              className={styles.input}
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              placeholder="Amount"
              autoFocus
              required
            />

            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn}>Save</button>
              <button type="button" onClick={() => setIsEditingSalary(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div className={`${styles.cardValue} ${styles.primary}`}>Rs. {salary.toLocaleString()}</div>
            
            {expectedSalary > 0 && (
              <div className={`${styles.varianceBadge} ${varianceClass}`}>
                {varianceText}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Other Incomes</div>
        <div className={`${styles.cardValue} ${styles.success}`}>Rs. {totalIncomes.toLocaleString()}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Total Expenses</div>
        <div className={`${styles.cardValue} ${styles.danger}`}>Rs. {totalExpenses.toLocaleString()}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Total Savings</div>
        <div className={`${styles.cardValue} ${styles.primary}`} style={{color: '#3b82f6'}}>Rs. {totalSavings.toLocaleString()}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Remaining Balance</div>
        <div className={`${styles.cardValue} ${styles.success}`}>Rs. {remainingSalary.toLocaleString()}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Daily Budget ({daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left)</div>
        <div className={`${styles.cardValue} ${styles.warning}`}>Rs. {dailyLimit.toFixed(2)}</div>
      </div>
    </div>
  );
}

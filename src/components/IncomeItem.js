import React, { useState } from 'react';
import styles from './IncomeList.module.css';

export default function IncomeItem({ income, deleteIncome, updateIncome }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(income.description);
  const [editAmount, setEditAmount] = useState(income.amount);
  const [editDate, setEditDate] = useState(new Date(income.date).toISOString().split('T')[0]);

  const handleEditSubmit = async () => {
    if (!editDesc || !editAmount || !editDate) return;
    const origDate = new Date(income.date);
    const [year, month, day] = editDate.split('-');
    const finalDate = new Date(year, month - 1, day, origDate.getHours(), origDate.getMinutes(), origDate.getSeconds());
    const success = await updateIncome(income._id, editDesc, editAmount, finalDate.toISOString());
    if (success) setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.incomeItem}>
        <div className={styles.editForm}>
          <input 
            type="date"
            className={styles.input} 
            value={editDate} 
            onChange={(e) => setEditDate(e.target.value)} 
          />
          <input 
            className={styles.input} 
            value={editDesc} 
            onChange={(e) => setEditDesc(e.target.value)} 
            placeholder="Description"
          />
          <input 
            className={styles.input} 
            type="number"
            value={editAmount} 
            onChange={(e) => setEditAmount(e.target.value)} 
            placeholder="Amount"
          />
          <div className={styles.editActions}>
            <button className={styles.saveBtn} onClick={handleEditSubmit}>Save</button>
            <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.incomeItem}>
      <div className={styles.incomeInfo}>
        <span className={styles.incomeDesc}>{income.description}</span>
        <span className={styles.incomeDate}>
          {new Date(income.date).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}
        </span>
      </div>
      <div className={styles.incomeRightContent}>
        <div className={styles.incomeAmount}>
          +Rs. {income.amount.toLocaleString()}
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.iconBtn} onClick={() => setIsEditing(true)}>✏️</button>
          <button className={styles.iconBtn} onClick={() => deleteIncome(income._id)}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

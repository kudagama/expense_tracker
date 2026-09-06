import React, { useState } from 'react';
import styles from './ExpenseList.module.css';

export default function ExpenseItem({ expense, deleteExpense, updateExpense }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(expense.description);
  const [editAmount, setEditAmount] = useState(expense.amount);
  const [editDate, setEditDate] = useState(new Date(expense.date).toISOString().split('T')[0]);

  const handleEditSubmit = async () => {
    if (!editDesc || !editAmount || !editDate) return;
    const origDate = new Date(expense.date);
    const [year, month, day] = editDate.split('-');
    const finalDate = new Date(year, month - 1, day, origDate.getHours(), origDate.getMinutes(), origDate.getSeconds());
    const success = await updateExpense(expense._id, editDesc, editAmount, finalDate.toISOString());
    if (success) setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.expenseItem}>
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
    <div className={styles.expenseItem}>
      <div className={styles.expenseInfo}>
        <span className={styles.expenseDesc}>{expense.description}</span>
        <span className={styles.expenseDate}>
          {new Date(expense.date).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}
        </span>
      </div>
      <div className={styles.expenseRightContent}>
        <div className={styles.expenseAmount}>
          -Rs. {expense.amount.toLocaleString()}
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.iconBtn} onClick={() => setIsEditing(true)}>✏️</button>
          <button className={styles.iconBtn} onClick={() => deleteExpense(expense._id)}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import styles from './SavingsList.module.css';
import Swal from 'sweetalert2';

export default function SavingsItem({ saving, deleteSavings, updateSavings, transferSavingsToWallet }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(saving.description);
  const [editAmount, setEditAmount] = useState(saving.amount);
  const [editDate, setEditDate] = useState(new Date(saving.date).toISOString().split('T')[0]);

  const handleEditSubmit = async () => {
    if (!editDesc || !editAmount || !editDate) return;
    const success = await updateSavings(saving._id, editDesc, editAmount, editDate);
    if (success) setIsEditing(false);
  };

  const handleTransfer = async () => {
    const { value: amount } = await Swal.fire({
      title: 'Transfer to Wallet',
      text: `Available savings: Rs. ${saving.amount.toLocaleString()}`,
      input: 'number',
      inputLabel: 'Amount to transfer',
      inputValue: saving.amount,
      showCancelButton: true,
      confirmButtonText: 'Transfer',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#334155',
      background: '#1e293b',
      color: '#f8fafc',
      inputValidator: (value) => {
        if (!value || Number(value) <= 0) return 'Please enter a valid amount!';
        if (Number(value) > saving.amount) return 'Cannot transfer more than available savings!';
      }
    });

    if (amount) {
      await transferSavingsToWallet(saving._id, Number(amount));
    }
  };

  if (isEditing) {
    return (
      <div className={styles.savingItem}>
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
            placeholder="Goal/Description"
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
    <div className={styles.savingItem}>
      <div className={styles.savingInfo}>
        <span className={styles.savingDesc}>{saving.description}</span>
        <span className={styles.savingDate}>
          {new Date(saving.date).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}
        </span>
      </div>
      <div className={styles.savingRightContent}>
        <div className={styles.savingAmount}>
          Rs. {saving.amount.toLocaleString()}
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.iconBtn} onClick={handleTransfer} title="Transfer to Wallet">💸</button>
          <button className={styles.iconBtn} onClick={() => setIsEditing(true)}>✏️</button>
          <button className={styles.iconBtn} onClick={() => deleteSavings(saving._id)}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

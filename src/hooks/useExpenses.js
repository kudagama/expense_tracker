import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { expenseService } from '../services/expenseService';

export function useExpenses(initialMonth) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || new Date().toISOString().slice(0, 7)); // YYYY-MM

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const json = await expenseService.getExpenses(selectedMonth);
      setData(json);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSalary = async (salary, salaryDate) => {
    try {
      await expenseService.updateSalary({ month: selectedMonth, salary: Number(salary), salaryDate });
      toast.success('Salary updated successfully!');
      fetchData();
      return true;
    } catch (error) {
      toast.error('Failed to update salary');
      return false;
    }
  };

  const addExpense = async (amount, description) => {
    try {
      await expenseService.addExpense({ month: selectedMonth, amount: Number(amount), description });
      toast.success('Expense added!');
      fetchData();
      return true;
    } catch (error) {
      toast.error('Failed to add expense');
      return false;
    }
  };

  const deleteExpense = async (expenseId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#f8fafc'
    });

    if (!result.isConfirmed) return false;

    try {
      await expenseService.deleteExpense({ month: selectedMonth, expenseId });
      toast.success('Expense deleted!');
      fetchData();
      return true;
    } catch (error) {
      toast.error('Failed to delete expense');
      return false;
    }
  };

  const updateExpense = async (expenseId, description, amount) => {
    try {
      await expenseService.updateExpense({ month: selectedMonth, expenseId, description, amount: Number(amount) });
      toast.success('Expense updated!');
      fetchData();
      return true;
    } catch (error) {
      toast.error('Failed to update expense');
      return false;
    }
  };

  return {
    data,
    loading,
    selectedMonth,
    setSelectedMonth,
    updateSalary,
    addExpense,
    deleteExpense,
    updateExpense
  };
}

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { expenseService } from '../services/expenseService';
import { getCycleMonth } from '../lib/dateUtils';

export function useExpenses(initialMonth) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || getCycleMonth()); // YYYY-MM

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

  const addExpense = async (amount, description, date) => {
    try {
      const targetMonth = getCycleMonth(date);
      await expenseService.addExpense({ month: targetMonth, amount: Number(amount), description, date });
      toast.success('Expense added!');
      
      if (targetMonth !== selectedMonth) {
        setSelectedMonth(targetMonth);
      } else {
        fetchData();
      }
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

  const updateExpense = async (expenseId, description, amount, date) => {
    try {
      const targetMonth = getCycleMonth(date);
      
      if (targetMonth !== selectedMonth) {
        await expenseService.deleteExpense({ month: selectedMonth, expenseId });
        await expenseService.addExpense({ month: targetMonth, amount: Number(amount), description, date });
        toast.success(`Expense moved to ${targetMonth}!`);
        setSelectedMonth(targetMonth);
      } else {
        await expenseService.updateExpense({ month: selectedMonth, expenseId, description, amount: Number(amount), date });
        toast.success('Expense updated!');
        fetchData();
      }
      return true;
    } catch (error) {
      toast.error('Failed to update expense');
      return false;
    }
  };

  const addIncome = async (amount, description, date) => {
    try {
      const targetMonth = getCycleMonth(date);
      await expenseService.addIncome({ month: targetMonth, amount: Number(amount), description, date });
      toast.success('Income added!');
      
      if (targetMonth !== selectedMonth) {
        setSelectedMonth(targetMonth);
      } else {
        fetchData();
      }
      return true;
    } catch (error) {
      toast.error('Failed to add income');
      return false;
    }
  };

  const deleteIncome = async (incomeId) => {
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
      await expenseService.deleteIncome({ month: selectedMonth, incomeId });
      toast.success('Income deleted!');
      fetchData();
      return true;
    } catch (error) {
      toast.error('Failed to delete income');
      return false;
    }
  };

  const updateIncome = async (incomeId, description, amount, date) => {
    try {
      const targetMonth = getCycleMonth(date);
      
      if (targetMonth !== selectedMonth) {
        await expenseService.deleteIncome({ month: selectedMonth, incomeId });
        await expenseService.addIncome({ month: targetMonth, amount: Number(amount), description, date });
        toast.success(`Income moved to ${targetMonth}!`);
        setSelectedMonth(targetMonth);
      } else {
        await expenseService.updateIncome({ month: selectedMonth, incomeId, description, amount: Number(amount), date });
        toast.success('Income updated!');
        fetchData();
      }
      return true;
    } catch (error) {
      toast.error('Failed to update income');
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
    updateExpense,
    addIncome,
    deleteIncome,
    updateIncome
  };
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';

export async function POST(request) {
  try {
    const body = await request.json();
    const { month, amount, description } = body;

    if (!month || !amount || !description) {
      return NextResponse.json({ error: 'Month, amount, and description are required' }, { status: 400 });
    }

    await dbConnect();

    let monthData = await MonthData.findOne({ month });
    if (!monthData) {
      monthData = new MonthData({ month, salary: 0, expenses: [] });
    }

    monthData.expenses.push({
      amount: Number(amount),
      description,
      date: new Date()
    });

    await monthData.save();

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { month, expenseId, amount, description } = body;

    if (!month || !expenseId || !amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const monthData = await MonthData.findOne({ month });
    if (!monthData) {
      return NextResponse.json({ error: 'Month not found' }, { status: 404 });
    }

    const expense = monthData.expenses.id(expenseId);
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    expense.amount = Number(amount);
    expense.description = description;

    await monthData.save();

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { month, expenseId } = body;

    if (!month || !expenseId) {
      return NextResponse.json({ error: 'Month and expenseId are required' }, { status: 400 });
    }

    await dbConnect();

    const monthData = await MonthData.findOne({ month });
    if (!monthData) {
      return NextResponse.json({ error: 'Month not found' }, { status: 404 });
    }

    monthData.expenses.pull(expenseId);

    await monthData.save();

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

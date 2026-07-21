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

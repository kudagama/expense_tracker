import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { month, amount, description, date } = body;

    if (!month || !amount || !description) {
      return NextResponse.json({ error: 'Month, amount, and description are required' }, { status: 400 });
    }

    await dbConnect();

    let monthData = await MonthData.findOne({ month, userId: user.userId });
    if (!monthData) {
      monthData = new MonthData({ month, userId: user.userId, salary: 0, expenses: [], incomes: [], savings: [] });
    }

    monthData.savings.push({
      amount: Number(amount),
      description,
      date: date ? new Date(date) : new Date()
    });

    await monthData.save();

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error adding savings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { month, savingsId, amount, description, date } = body;

    if (!month || !savingsId || !amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const monthData = await MonthData.findOne({ month, userId: user.userId });
    if (!monthData) {
      return NextResponse.json({ error: 'Month not found' }, { status: 404 });
    }

    const savings = monthData.savings.id(savingsId);
    if (!savings) {
      return NextResponse.json({ error: 'Savings not found' }, { status: 404 });
    }

    savings.amount = Number(amount);
    savings.description = description;
    if (date) {
      savings.date = new Date(date);
    }

    await monthData.save();

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error updating savings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { month, savingsId } = body;

    if (!month || !savingsId) {
      return NextResponse.json({ error: 'Month and savingsId are required' }, { status: 400 });
    }

    await dbConnect();

    const monthData = await MonthData.findOne({ month, userId: user.userId });
    if (!monthData) {
      return NextResponse.json({ error: 'Month not found' }, { status: 404 });
    }

    monthData.savings.pull(savingsId);

    await monthData.save();

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error deleting savings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

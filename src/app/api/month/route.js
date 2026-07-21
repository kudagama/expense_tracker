import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json({ error: 'Month is required' }, { status: 400 });
    }

    await dbConnect();

    let monthData = await MonthData.findOne({ month });
    if (!monthData) {
      monthData = await MonthData.create({ month, salary: 0, expenses: [] });
    }

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error fetching month data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { month, salary, salaryDate } = body;

    if (!month || salary === undefined) {
      return NextResponse.json({ error: 'Month and salary are required' }, { status: 400 });
    }

    await dbConnect();

    let monthData = await MonthData.findOne({ month });
    if (!monthData) {
      monthData = new MonthData({ month, salary, salaryDate: salaryDate || null, expenses: [] });
    } else {
      monthData.salary = salary;
      if (salaryDate !== undefined) {
        monthData.salaryDate = salaryDate;
      }
    }
    
    await monthData.save();

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error updating salary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

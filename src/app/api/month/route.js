import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json({ error: 'Month is required' }, { status: 400 });
    }

    await dbConnect();

    let monthData = await MonthData.findOne({ month, userId: authUser.userId });
    if (!monthData) {
      // Fetch the full user to get their defaults
      const User = require('@/models/User').default;
      const userDoc = await User.findById(authUser.userId);
      const defaultSal = userDoc?.defaultSalary || 0;
      const defaultSalDate = userDoc?.defaultSalaryDate || null;
      
      monthData = await MonthData.create({ 
        month, 
        userId: authUser.userId, 
        salary: defaultSal, 
        salaryDate: defaultSalDate,
        expenses: [] 
      });
    }

    return NextResponse.json(monthData);
  } catch (error) {
    console.error('Error fetching month data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { month, salary, salaryDate } = body;

    if (!month || salary === undefined) {
      return NextResponse.json({ error: 'Month and salary are required' }, { status: 400 });
    }

    await dbConnect();

    let monthData = await MonthData.findOne({ month, userId: user.userId });
    if (!monthData) {
      monthData = new MonthData({ month, userId: user.userId, salary, salaryDate: salaryDate || null, expenses: [] });
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

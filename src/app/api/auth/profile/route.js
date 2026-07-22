import { NextResponse } from 'next/server';
import connectMongo from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { getAuthUser } from '../../../../lib/auth';

export async function PUT(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, defaultSalary, defaultSalaryDate } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectMongo();

    const updatedUser = await User.findByIdAndUpdate(
      authUser.userId,
      {
        name,
        defaultSalary: Number(defaultSalary) || 0,
        defaultSalaryDate: defaultSalaryDate || null,
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';
import { getAuthUser } from '@/lib/auth';
const keys=['Food & drinks','Transport','Shopping','Bills','Health','Entertainment','Other'];
const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1e9;
export async function PUT(request){
 try{
  const user=await getAuthUser();
  if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const {month,plan}=await request.json();
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||!plan||!valid(plan.dailyLimit)||!plan.limits||!Array.isArray(plan.bills)||plan.bills.length>100)return NextResponse.json({error:'Invalid plan'},{status:400});
  const limits={};for(const key of keys){const n=plan.limits[key]??0;if(!valid(n))return NextResponse.json({error:'Invalid limit'},{status:400});limits[key]=n;}
  const bills=[];for(const b of plan.bills){if(typeof b.name!=='string'||!b.name.trim()||b.name.length>100||!valid(b.amount)||b.amount===0||!/^\d{4}-\d{2}-\d{2}$/.test(b.dueDate)||typeof b.paid!=='boolean')return NextResponse.json({error:'Invalid bill'},{status:400});bills.push({name:b.name.trim(),amount:b.amount,dueDate:b.dueDate,paid:b.paid});}
  await dbConnect();
  const result=await MonthData.findOneAndUpdate({month,userId:user.userId},{$set:{budgetPlan:{dailyLimit:plan.dailyLimit,limits,bills}}},{new:true,runValidators:true});
  if(!result)return NextResponse.json({error:'Cycle not found'},{status:404});
  return NextResponse.json({budgetPlan:result.budgetPlan});
 }catch(e){return NextResponse.json({error:'Unable to save budget'},{status:500});}
}

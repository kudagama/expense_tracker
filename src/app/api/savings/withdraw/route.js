import {NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';
import {getAuthUser} from '@/lib/auth';
export async function POST(request){
 try{
 const user=await getAuthUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {month,savingsId,amount,requestId}=await request.json();
 if(typeof month!=='string'||!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||typeof savingsId!=='string'||!/^[a-f0-9]{24}$/i.test(savingsId)||typeof requestId!=='string'||!/^[a-f0-9-]{36}$/i.test(requestId)||typeof amount!=='number'||!Number.isFinite(amount)||amount<=0||amount>1e9||Math.abs(amount*100-Math.round(amount*100))>0.00001)return NextResponse.json({error:'Invalid withdrawal'},{status:400});
 await dbConnect();
 const filter={month,userId:user.userId,'withdrawals.requestId':{$ne:requestId},savings:{$elemMatch:{_id:savingsId,amount:{$gte:amount}}}};
 const result=await MonthData.findOneAndUpdate(filter,{$inc:{'savings.$.amount':-amount},$push:{withdrawals:{requestId,savingsId,amount,date:new Date()}}},{new:true});
 if(!result){const existing=await MonthData.findOne({month,userId:user.userId,'withdrawals':{$elemMatch:{requestId,savingsId,amount}}});if(existing)return NextResponse.json({ok:true});return NextResponse.json({error:'Insufficient savings or conflicting request'},{status:409});}
 return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Unable to withdraw savings'},{status:500});}
}

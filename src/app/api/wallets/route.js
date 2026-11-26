import {NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';
import {getAuthUser} from '@/lib/auth';
const keys=['cash','bank','savings','credit'];
const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1e9;
export async function PUT(request){
 try{
 const user=await getAuthUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {month,plan}=await request.json();
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||!plan?.opening||!Array.isArray(plan.transfers)||plan.transfers.length>500)return NextResponse.json({error:'Invalid wallet plan'},{status:400});
 const opening={};for(const k of keys){const n=plan.opening[k]??0;if(!valid(n))return NextResponse.json({error:'Invalid opening amount'},{status:400});opening[k]=n;}
 const transfers=[];for(const t of plan.transfers){if(!keys.includes(t.from)||t.from==='credit'||!keys.includes(t.to)||t.from===t.to||!valid(t.amount)||t.amount===0)return NextResponse.json({error:'Invalid transfer'},{status:400});transfers.push({from:t.from,to:t.to,amount:t.amount});}
 await dbConnect();
 const result=await MonthData.findOneAndUpdate({month,userId:user.userId},{$set:{walletPlan:{opening,transfers}}},{new:true,runValidators:true});
 if(!result)return NextResponse.json({error:'Cycle not found'},{status:404});
 return NextResponse.json({walletPlan:result.walletPlan});
 }catch{return NextResponse.json({error:'Unable to save wallets'},{status:500});}
}

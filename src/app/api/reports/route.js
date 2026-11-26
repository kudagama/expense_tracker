import {NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthData from '@/models/MonthData';
import {getAuthUser} from '@/lib/auth';
export const dynamic='force-dynamic';
export async function GET(request){
 const user=await getAuthUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const month=new URL(request.url).searchParams.get('month');
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month||''))return NextResponse.json({error:'Invalid cycle'},{status:400});
 try{await dbConnect();const data=await MonthData.findOne({month,userId:user.userId}).select('month salary incomes expenses savings').lean();return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Report unavailable'},{status:500});}
}

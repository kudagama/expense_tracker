import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,required:true,index:true},name:{type:String,required:true},amount:{type:Number,required:true},day:{type:Number,required:true},paidMonths:{type:[String],default:[]}},{timestamps:true});
export default mongoose.models.RecurringBill||mongoose.model('RecurringBill',schema);
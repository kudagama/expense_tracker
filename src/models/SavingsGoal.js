import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,required:true,index:true},name:{type:String,required:true},target:{type:Number,required:true},allocated:{type:Number,default:0},deadline:String,category:String},{timestamps:true});
export default mongoose.models.SavingsGoal||mongoose.model('SavingsGoal',schema);
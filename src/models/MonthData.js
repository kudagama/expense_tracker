import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const MonthDataSchema = new mongoose.Schema({
  month: {
    type: String, // format: YYYY-MM
    required: true,
    unique: true
  },
  salary: {
    type: Number,
    default: 0
  },
  expenses: [ExpenseSchema]
}, { timestamps: true });

export default mongoose.models.MonthData || mongoose.model('MonthData', MonthDataSchema);

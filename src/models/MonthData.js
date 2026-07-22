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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String, // format: YYYY-MM
    required: true
  },
  salary: {
    type: Number,
    default: 0
  },
  expectedSalary: {
    type: Number,
    default: 0
  },
  salaryDate: {
    type: String, // Format: YYYY-MM-DD
    default: null
  },
  expenses: [ExpenseSchema]
}, { timestamps: true });

MonthDataSchema.index({ userId: 1, month: 1 }, { unique: true });

if (mongoose.models.MonthData) {
  delete mongoose.models.MonthData;
}

export default mongoose.model('MonthData', MonthDataSchema);

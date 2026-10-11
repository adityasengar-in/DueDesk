const mongoose= require('mongoose');
const { Schema } = mongoose;

const installmentSchema=new mongoose.Schema({
  feePlanId: { type: Schema.Types.ObjectId, ref: "FeePlan", required: true },
  amount: Number,
  dueDate: Date,
  status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
  paidAt: Date,
  reminder7dSentAt: Date,
  reminder2dSentAt: Date,
});

const InstallmentModel=mongoose.model('Installment',installmentSchema);

module.exports=InstallmentModel;
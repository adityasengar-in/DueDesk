const mongoose = require('mongoose');
const { Schema } = mongoose;

const feePlanSchema = new mongoose.Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
  memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ["weekly", "monthly"], default: "monthly" },
  nextDueDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
});

const FeePlanModel = mongoose.model('FeePlan', feePlanSchema);

module.exports = FeePlanModel;
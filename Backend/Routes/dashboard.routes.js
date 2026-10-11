const express = require("express");
const router = express.Router();
const FeePlan = require("../models/feePlan.model");
const Installment = require("../models/installment.model");
const Owner = require("../models/owner.model");
const requireAuth = require("../middleware/requireAuth");

// mounted at /api/dashboard
router.get("/", requireAuth, async (req, res) => {
  const plans = await FeePlan.find({ ownerId: req.ownerId }).populate("memberId", "name email");
  const installments = await Installment.find({ feePlanId: { $in: plans.map((p) => p._id) } });
  const owner = await Owner.findById(req.ownerId);

  const now = new Date();
  let collected = 0;
  let pending = 0;
  let overdueCount = 0;

  installments.forEach((i) => {
    if (i.status === "paid") collected += i.amount;
    else {
      pending += i.amount;
      if (i.dueDate < now) overdueCount++;
    }
  });

  const rows = plans.map((p) => {
    const current = installments.find(
      (i) => i.feePlanId.equals(p._id) && i.status !== "paid"
    );
    return {
      planId: p._id,
      memberName: p.memberId.name,
      amount: p.amount,
      frequency: p.frequency,
      status: p.status,
      nextInstallment: current
        ? { id: current._id, dueDate: current.dueDate, overdue: current.dueDate < now }
        : null,
    };
  });

  res.json({ collected, pending, overdueCount, rows, businessName: owner.businessName });
});

module.exports = router;
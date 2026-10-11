const express = require("express");
const router = express.Router();
const Installment = require("../models/installment.model");
const FeePlan = require("../models/feePlan.model");
const requireAuth = require("../middleware/requireAuth");

// mounted at /api/installments

// PATCH /api/installments/:id  { status: 'paid' | 'pending' }
router.patch("/:id", requireAuth, async (req, res) => {
  const installment = await Installment.findById(req.params.id);
  if (!installment) return res.status(404).json({ error: "Not found" });

  const feePlan = await FeePlan.findOne({ _id: installment.feePlanId, ownerId: req.ownerId });
  if (!feePlan) return res.status(404).json({ error: "Not found" });

  const { status } = req.body;
  installment.status = status;
  installment.paidAt = status === "paid" ? new Date() : null;
  await installment.save();

  // On payment, spin up the next cycle at the plan's current price — unless the plan was cancelled.
  if (status === "paid" && feePlan.status === "active") {
    const nextDue = feePlan.nextDueDate;
    const followingDue = new Date(nextDue);
    if (feePlan.frequency === "weekly") followingDue.setDate(followingDue.getDate() + 7);
    else followingDue.setMonth(followingDue.getMonth() + 1);

    await Installment.create({ feePlanId: feePlan._id, amount: feePlan.amount, dueDate: nextDue });
    feePlan.nextDueDate = followingDue;
    await feePlan.save();
  }

  res.json(installment);
});

module.exports = router;
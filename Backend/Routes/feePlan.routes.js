const express = require("express");
const router = express.Router();
const FeePlan = require("../models/feePlan.model");
const Installment = require("../models/installment.model");
const requireAuth = require("../middleware/requireAuth");

function addInterval(date, frequency, n) {
  const d = new Date(date);
  if (frequency === "weekly") d.setDate(d.getDate() + 7 * n);
  else d.setMonth(d.getMonth() + n);
  return d;
}

// mounted at /api/feeplans

// POST /api/feeplans
router.post("/", requireAuth, async (req, res) => {
  const { memberId, amount, frequency, startDate } = req.body;

  const feePlan = await FeePlan.create({
    ownerId: req.ownerId,
    memberId,
    amount,
    frequency,
    nextDueDate: addInterval(startDate, frequency, 1),
  });

  const firstInstallment = await Installment.create({
    feePlanId: feePlan._id,
    amount,
    dueDate: startDate,
  });

  res.status(201).json({ feePlan, installment: firstInstallment });
});

// PATCH /api/feeplans/:id  { amount?, status? }
// amount change affects future cycles only; already-generated pending installments are untouched.
router.patch("/:id", requireAuth, async (req, res) => {
  const { amount, status } = req.body;
  const update = {};
  if (amount !== undefined) update.amount = amount;
  if (status !== undefined) update.status = status;

  const feePlan = await FeePlan.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.ownerId },
    update,
    { new: true }
  );
  if (!feePlan) return res.status(404).json({ error: "Not found" });
  res.json(feePlan);
});

// GET /api/feeplans/:id  (with its installments)
router.get("/:id", requireAuth, async (req, res) => {
  const feePlan = await FeePlan.findOne({ _id: req.params.id, ownerId: req.ownerId }).populate("memberId","name email");
  if (!feePlan) return res.status(404).json({ error: "Not found" });
  const installments = await Installment.find({ feePlanId: feePlan._id }).sort("dueDate");
  res.json({ feePlan, installments });
});

// GET /api/feeplans
router.get("/", requireAuth, async (req, res) => {
  const plans = await FeePlan.find({ ownerId: req.ownerId }).sort("-createdAt");
  res.json(plans);
});

module.exports = router;
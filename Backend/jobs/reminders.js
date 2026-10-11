const cron = require("node-cron");
const Installment = require("../models/installment.model");
const sendEmail = require("../utils/sendEmail");

const DAY = 24 * 60 * 60 * 1000;

// midnight-to-midnight window for the day that is `daysAhead` from today
function dayRange(daysAhead) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + daysAhead);
  return { $gte: start, $lt: new Date(start.getTime() + DAY) };
}

async function sendBatch(daysAhead, sentField) {
  const installments = await Installment.find({
    status: "pending",
    dueDate: dayRange(daysAhead),
    [sentField]: null,
  }).populate({
    path: "feePlanId",
    populate: [{ path: "memberId" }, { path: "ownerId" }],
  });

  for (const i of installments) {
    const plan = i.feePlanId;
    if (!plan || plan.status !== "active") continue;

    const business = plan.ownerId.businessName || plan.ownerId.name;
    const text = `Hi ${plan.memberId.name}, your fee of ₹${i.amount} to ${business} is due on ${i.dueDate.toDateString()}.`;

    try {
      await sendEmail(plan.memberId.email, `Fee reminder from ${business}`, text);
      i[sentField] = new Date();
      await i.save();
    } catch (err) {
      console.log("Reminder failed for", plan.memberId.email, err.message);
    }
  }
}

async function runReminders() {
  await sendBatch(7, "reminder7dSentAt");
  await sendBatch(2, "reminder2dSentAt");
}

// every day at 9:00 AM server time
function startReminders() {
  cron.schedule("0 9 * * *", runReminders, { timezone: "Asia/Kolkata" });
}

module.exports = { startReminders, runReminders };
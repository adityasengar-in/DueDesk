const express = require("express");
const router = express.Router();
const Member = require("../models/member.model");
const requireAuth = require("../middleware/requireAuth");

// mounted at /api/members
router.post("/", requireAuth, async (req, res) => {
  const { name, email } = req.body;
  const member = await Member.create({ ownerId: req.ownerId, name, email });
  res.status(201).json(member);
});

router.get("/", requireAuth, async (req, res) => {
  const members = await Member.find({ ownerId: req.ownerId });
  res.json(members);
});

module.exports = router;
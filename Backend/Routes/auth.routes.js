const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Owner = require("../models/owner.model");
const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub, email, name } = ticket.getPayload();

    let owner = await Owner.findOne({ googleId: sub });
    if (!owner) owner = await Owner.create({ googleId: sub, email, name });

    const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, owner });
  } catch (err) {
    res.status(401).json({ error: "Google auth failed" });
  }
});

// update business name
router.patch("/me", requireAuth, async (req, res) => {
    const owner = await Owner.findByIdAndUpdate(
      req.ownerId,
      { businessName: req.body.businessName },
      { new: true }
    );
    res.json(owner);
});

// get my details
router.get("/me", requireAuth, (req, res) => res.json({ ownerId: req.ownerId }));

module.exports = router;
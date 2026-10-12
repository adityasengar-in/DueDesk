const express=require("express");
const cors = require("cors");
const authRoutes = require("../Routes/auth.routes");

const app=express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url, "origin:", req.headers.origin);
  next();
});
app.use("/api", authRoutes);
app.use("/api/members", require("../Routes/member.routes"));
app.use("/api/feeplans", require("../Routes/feePlan.routes"));
app.use("/api/installments", require("../Routes/installment.routes"));
app.use("/api/dashboard", require("../Routes/dashboard.routes"));

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.get("/health", (req, res) => res.send("ok"));

module.exports=app;

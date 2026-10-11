const mongoose= require('mongoose');

const ownerSchema=new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  businessName: String,
});

const OwnerModel= mongoose.model('Owner', ownerSchema);

module.exports = OwnerModel;
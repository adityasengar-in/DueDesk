const mongoose= require('mongoose');
const { Schema } = mongoose;

const memberSchema=new mongoose.Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
  name: String,
  email: String,
});

const MemberModel = mongoose.model('Member', memberSchema);

module.exports=MemberModel;
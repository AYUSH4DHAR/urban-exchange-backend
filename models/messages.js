const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  buyer: {
    type: String,
    required: false
  },
  messages : [{
    chatPartner: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    }
  }]
,
  prodId: {
    type: ObjectId,
    required: false
  },

  seller : {
    type: String,
    required: true
  }
  
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
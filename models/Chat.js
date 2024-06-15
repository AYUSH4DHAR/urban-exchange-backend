const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  buyer: {
    type: ObjectId,
    required: true,
  },
  buyerInfo: {
    type: Object,
    required: true,
  },
  sellerInfo: {
    type: Object,
    required: true,
  },
  seller: {
    type: ObjectId,
    required: true,
  },
  messages: {
    type:
      [
        {
          sender: {
            type: ObjectId,
            required: true,
          },
          messageText: {
            type: String,
            required: true,
          },
          postedTime: {
            type: Date,
            required: false,
          },
        }
      ],
    default: []
  },
  unread: {
    type: Number,
    required: true,
  },
  unreadBy: {
    type: ObjectId,
    required: true,
  },
  prodId: {
    type: ObjectId,
    required: false
  },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
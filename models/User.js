const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// mongoose.set("useCreateIndex", true);
// ---------------------------------------------------------------$$$$$$$$$$$$$_---------------
//can look into indexing later @sidharth

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  description: { type: String, required: false },

  avatar: { type: String, required: false },
  productsListed: { type: Array },
  productsPurchased: { type: Array },
  Phone: { type: Array },
  wishlist: { type: Array },
  lastLogin: { type: Date },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

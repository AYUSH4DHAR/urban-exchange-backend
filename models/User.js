const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// mongoose.set("useCreateIndex", true);
// ---------------------------------------------------------------$$$$$$$$$$$$$_---------------
//can look into indexing later @sidharth

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: false },
  productsListed: { type: Array },
  productsPurchased: { type: Array },
  Phone: { type: Array },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

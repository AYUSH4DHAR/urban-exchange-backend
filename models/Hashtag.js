const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const hashTagSchema = mongoose.Schema({
    tag: { type: String, unique: true },
    items: { type: Number },
});

hashTagSchema.plugin(uniqueValidator);
module.exports = mongoose.model("HashTag", hashTagSchema);
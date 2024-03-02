const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const imageSchema = mongoose.Schema({
    name: { type: String, unique: true },
    secureUrl: { type: String, },
    version: { type: String, },
    publicId: { type: String, },
    signature: { type: String, },
    folder: { type: String, },
    originalFilename: { type: String },
});

imageSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Image", imageSchema);
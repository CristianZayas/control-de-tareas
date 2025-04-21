const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const mongoose = require('mongoose')
const countIntentosSchemas = new Schema(
  {
    time: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Referencia a tu modelo de Usuario
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("countIntento", countIntentosSchemas);

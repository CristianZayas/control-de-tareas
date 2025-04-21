const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const mongoose = require('mongoose')
const countSchemas = new Schema(
  {
   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Referencia a tu modelo de Usuario
    },
    count: Number
  },
  {
    timestamps: true,
  }
);

module.exports = model("count", countSchemas);
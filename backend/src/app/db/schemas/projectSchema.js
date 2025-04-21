const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectSchema = new Schema(
  {
    name: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("project", projectSchema);

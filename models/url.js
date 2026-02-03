const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    visitHistory: [
      {
        timestamp: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);

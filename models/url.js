const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },

    redirectURL: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      default: null,
    },

    // 🔥 OPTIONAL UNIQUE FIELD (SAFE)
    customAlias: {
      type: String,
      unique: true,
      sparse: true, // IMPORTANT
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    visitHistory: [
      {
        timestamp: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);

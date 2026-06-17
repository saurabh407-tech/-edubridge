const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    condition: { type: String, enum: ["new", "like_new", "good", "fair", "poor"], required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    location: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },

    availability: { type: String, enum: ["available", "reserved", "sold"], default: "available" },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reservedAt: { type: Date },

    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    subject: { type: String },
    branch: { type: String },
    semester: { type: Number },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bookSchema.index({ bookName: "text", author: "text", subject: "text" });
bookSchema.index({ availability: 1, location: 1 });

module.exports = mongoose.model("Book", bookSchema);

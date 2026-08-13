const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Book = require("../models/Book");
const { uploadImage, uploadToCloudinary } = require("../middleware/upload");
const { createNotification } = require("../services/notificationService");

// GET all books
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 12, availability, branch, search } = req.query;
    const query = { isActive: true };
    if (availability) query.availability = availability;
    if (branch) query.branch = branch;
    if (search) {
      query.$or = [
        { bookName: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
      ];
    }

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate("seller", "name profilePhoto phone collegeName branch")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: books,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

// POST create book listing
router.post("/", protect, uploadImage.array("images", 5), async (req, res, next) => {
  try {
    console.log("🔥 BOOK UPLOAD STARTED");
    console.log("📁 Files received:", req.files?.length || 0);

    // Upload all images to Cloudinary
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        console.log("⬆️ Uploading:", file.originalname);

        const result = await uploadToCloudinary(
          file.buffer,
          file.mimetype,
          "edubridge/books"
        );

        console.log("☁️ Cloudinary URL:", result.secure_url);

        images.push(result.secure_url);
      }
    }

    console.log("🖼️ Final images:", images);

    const bookData = {
      ...req.body,
      images,
      seller: req.user._id,
      price:
        req.body.isFree === "true"
          ? 0
          : parseFloat(req.body.price) || 0,
    };

    const book = await Book.create(bookData);

    await book.populate(
      "seller",
      "name profilePhoto phone collegeName"
    );

    console.log("✅ Book created:", book._id);
    console.log("✅ Saved images:", book.images);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (err) {
    console.error("❌ Book upload error:", err);
    next(err);
  }
});

// GET single book
router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("seller", "name profilePhoto phone collegeName branch")
      .populate("reservedBy", "name profilePhoto");
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.json({ success: true, data: book });
  } catch (err) { next(err); }
});

// POST reserve a book
router.post("/:id/reserve", protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("seller", "name _id");

    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.availability !== "available") {
      return res.status(400).json({ success: false, message: "Book is not available" });
    }
    if (book.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot reserve your own book" });
    }

    book.availability = "reserved";
    book.reservedBy = req.user._id;
    book.reservedAt = new Date();
    await book.save();

    // Seller ko notification bhejo
    await createNotification({
      recipient: book.seller._id,
      sender: req.user._id,
      type: "book_reserved",
      title: "Your Book has been Reserved! 📚",
      message: `${req.user.name} has reserved "${book.bookName}" — contact them to arrange handover.`,
      link: `/books/${book._id}`,
      io: req.io,
    });

    res.json({ success: true, message: "Book reserved successfully!" });
  } catch (err) { next(err); }
});

// DELETE remove book
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });
    book.isActive = false;
    await book.save();
    res.json({ success: true, message: "Book listing removed" });
  } catch (err) { next(err); }
});

module.exports = router;
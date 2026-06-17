require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("resources");

    // List existing indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes.map(i => i.name));

    // Drop the problematic fileHash index
    try {
      await collection.dropIndex("fileHash_1");
      console.log("✅ Dropped index: fileHash_1");
    } catch (err) {
      console.log("⚠️ Index fileHash_1 not found or already dropped:", err.message);
    }

    // Also try contentHash in case it's named differently
    try {
      await collection.dropIndex("contentHash_1");
      console.log("✅ Dropped index: contentHash_1");
    } catch (err) {
      console.log("⚠️ Index contentHash_1 not found:", err.message);
    }

    const indexesAfter = await collection.indexes();
    console.log("\nRemaining indexes:", indexesAfter.map(i => i.name));

    console.log("\n✅ Done! You can now upload resources without fileHash errors.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

dropIndex();
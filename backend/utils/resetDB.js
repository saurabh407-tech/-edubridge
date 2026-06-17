require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

const resetDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const db = mongoose.connection.db;

    // Sirf ye collections delete karo — system collections ko mat chhuona
    const collectionsToDelete = [
      "resources",
      "mentorships",
      "projects",
      "books",
      "opportunities",
      "messages",
      "notifications",
      "users",
      "colleges",
      "universities",
    ];

    for (const name of collectionsToDelete) {
      try {
        await db.collection(name).deleteMany({});
        console.log(`🗑️  Cleared: ${name}`);
      } catch (err) {
        console.log(`⚠️  Skipped: ${name} (${err.message})`);
      }
    }

    console.log("\n✅ All data cleared! Fresh start karo.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

resetDB();
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const { University, College } = require("../models/University");

const universities = [
  { name: "Dr. A.P.J. Abdul Kalam Technical University", shortName: "AKTU", state: "Uttar Pradesh" },
  { name: "Delhi University", shortName: "DU", state: "Delhi" },
  { name: "Guru Gobind Singh Indraprastha University", shortName: "GGSIPU", state: "Delhi" },
  { name: "Mumbai University", shortName: "MU", state: "Maharashtra" },
  { name: "Lucknow University", shortName: "LU", state: "Uttar Pradesh" },
  { name: "Amity University", shortName: "Amity", state: "Uttar Pradesh" },
  { name: "Galgotias University", shortName: "GU", state: "Uttar Pradesh" },
  { name: "Bennett University", shortName: "BU", state: "Uttar Pradesh" },
  { name: "Kerala Technological University", shortName: "KTU", state: "Kerala" },
  { name: "Visvesvaraya Technological University", shortName: "VTU", state: "Karnataka" },
  { name: "Anna University", shortName: "Anna", state: "Tamil Nadu" },
  { name: "Jawaharlal Nehru Technological University", shortName: "JNTU", state: "Telangana" },
  { name: "Pune University", shortName: "SPPU", state: "Maharashtra" },
  { name: "Rajasthan Technical University", shortName: "RTU", state: "Rajasthan" },
  { name: "Punjab Technical University", shortName: "PTU", state: "Punjab" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await University.deleteMany({});
    const createdUniversities = await University.insertMany(universities);
    console.log(`✅ Seeded ${createdUniversities.length} universities`);

    const aktu = createdUniversities.find(u => u.shortName === "AKTU");
    if (aktu) {
      await College.deleteMany({});
      const colleges = [
        { name: "Galgotias College of Engineering and Technology", universityId: aktu._id, state: "Uttar Pradesh", city: "Greater Noida", isApproved: true },
        { name: "Amity School of Engineering", universityId: aktu._id, state: "Uttar Pradesh", city: "Noida", isApproved: true },
        { name: "JSS Academy of Technical Education", universityId: aktu._id, state: "Uttar Pradesh", city: "Noida", isApproved: true },
        { name: "Sharda University", universityId: aktu._id, state: "Uttar Pradesh", city: "Greater Noida", isApproved: true },
        { name: "Raj Kumar Goel Institute of Technology", universityId: aktu._id, state: "Uttar Pradesh", city: "Ghaziabad", isApproved: true },
      ];
      await College.insertMany(colleges);
      console.log(`✅ Seeded ${colleges.length} colleges`);
    }

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
};

seedDB();
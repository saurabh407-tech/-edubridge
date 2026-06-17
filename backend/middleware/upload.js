const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Multer memory storage use karo
const storage = multer.memoryStorage();

const uploadToCloudinary = async (fileBuffer, mimetype, folder) => {
  const isPDF = mimetype === "application/pdf";
  const isDoc = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/zip"
  ].includes(mimetype);

  const resourceType = (isPDF || isDoc) ? "raw" : "auto";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

exports.uploadResource = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
exports.uploadImage = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadProfile = multer({ storage, limits: { fileSize: 3 * 1024 * 1024 } });
exports.uploadResume = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
exports.uploadToCloudinary = uploadToCloudinary;
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { uploadResource: uploadMiddleware } = require("../middleware/upload");
const {
  uploadResource, getResources, getResource,
  downloadResource, rateResource, deleteResource,
} = require("../controllers/resourceController");

router.route("/")
  .get(getResources)
  .post(protect, uploadMiddleware.single("file"), uploadResource);

router.route("/:id")
  .get(getResource)
  .delete(protect, deleteResource);

router.post("/:id/download", protect, downloadResource);
router.post("/:id/rate", protect, rateResource);

module.exports = router;

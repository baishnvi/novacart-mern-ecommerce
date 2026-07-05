const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// @desc    Upload a single generic image (admin use, e.g. banners)
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest("No image file provided");

    const folder = req.body.folder || "novacart/misc";
    const result = await uploadToCloudinary(req.file.buffer, folder);

    return sendSuccess(res, 201, "Image uploaded successfully", {
      url: result.secure_url,
      publicId: result.public_id,
    });
  })
);

// @desc    Delete an uploaded image by public id
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete(
  "/:publicId",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    await deleteFromCloudinary(decodeURIComponent(req.params.publicId));
    return sendSuccess(res, 200, "Image deleted successfully");
  })
);

module.exports = router;

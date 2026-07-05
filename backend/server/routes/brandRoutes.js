const express = require("express");
const {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/", getBrands);
router.get("/:slug", getBrandBySlug);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("logo"),
  [body("name").trim().notEmpty().withMessage("Brand name is required")],
  validate,
  createBrand
);
router.put("/:id", protect, authorize("admin"), upload.single("logo"), updateBrand);
router.delete("/:id", protect, authorize("admin"), deleteBrand);

module.exports = router;

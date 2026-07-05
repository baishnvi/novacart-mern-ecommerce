const express = require("express");
const { body } = require("express-validator");
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/couponController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/validate/:code", protect, validateCoupon);

router.use(protect, authorize("admin"));

router.get("/", getCoupons);
router.post(
  "/",
  [
    body("code").trim().notEmpty().withMessage("Coupon code is required"),
    body("discountType").isIn(["percentage", "flat"]).withMessage("Invalid discount type"),
    body("discountValue").isFloat({ min: 0 }).withMessage("Discount value must be positive"),
    body("validUntil").isISO8601().withMessage("Valid expiration date required"),
  ],
  validate,
  createCoupon
);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;

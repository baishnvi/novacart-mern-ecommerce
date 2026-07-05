const express = require("express");
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post(
  "/items",
  [
    body("productId").isMongoId().withMessage("Valid product id is required"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ],
  validate,
  addItemToCart
);
router.put(
  "/items/:itemId",
  [body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")],
  validate,
  updateCartItem
);
router.delete("/items/:itemId", removeCartItem);
router.delete("/", clearCart);
router.post("/coupon", [body("code").notEmpty().withMessage("Coupon code is required")], validate, applyCoupon);
router.delete("/coupon", removeCoupon);

module.exports = router;

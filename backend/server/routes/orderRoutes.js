const express = require("express");
const { body } = require("express-validator");
const {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.post("/create-payment-intent", createPaymentIntent);

router.post(
  "/",
  [
    body("shippingAddress").isObject().withMessage("Shipping address is required"),
    body("paymentMethod").isIn(["stripe", "cod"]).withMessage("Invalid payment method"),
  ],
  validate,
  createOrder
);

router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

router.get("/", authorize("admin"), getAllOrders);
router.put(
  "/:id/status",
  authorize("admin"),
  [body("status").isIn(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"])],
  validate,
  updateOrderStatus
);

module.exports = router;

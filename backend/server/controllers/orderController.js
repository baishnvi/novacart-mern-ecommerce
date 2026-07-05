const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const stripe = require("../config/stripe");

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_RATE = 9.99;

const calculateTotals = (cart) => {
  const itemsPrice = cart.subtotal;

  let discountAmount = 0;
  if (cart.coupon?.code) {
    if (cart.coupon.discountType === "percentage") {
      discountAmount = (itemsPrice * cart.coupon.discountValue) / 100;
    } else {
      discountAmount = cart.coupon.discountValue;
    }
  }

  const discountedSubtotal = Math.max(itemsPrice - discountAmount, 0);
  const taxPrice = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
  const shippingPrice = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const totalPrice = Math.round((discountedSubtotal + taxPrice + shippingPrice) * 100) / 100;

  return { itemsPrice, discountAmount, taxPrice, shippingPrice, totalPrice };
};

// @desc    Create a Stripe payment intent for the current cart
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest("Your cart is empty");
  }

  const { totalPrice } = calculateTotals(cart);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalPrice * 100),
    currency: "usd",
    metadata: { userId: req.user._id.toString() },
    automatic_payment_methods: { enabled: true },
  });

  return sendSuccess(res, 200, "Payment intent created", {
    clientSecret: paymentIntent.client_secret,
    totalPrice,
  });
});

// @desc    Place an order (after successful payment or COD)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, paymentIntentId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest("Your cart is empty");
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) throw ApiError.notFound(`Product ${item.name} no longer exists`);

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (!variant || variant.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for ${item.name}`);
      }
    } else if (product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${item.name}`);
    }
  }

  const { itemsPrice, discountAmount, taxPrice, shippingPrice, totalPrice } = calculateTotals(cart);

  let paymentResult = {};
  let isPaid = false;

  if (paymentMethod === "stripe") {
    if (!paymentIntentId) throw ApiError.badRequest("Payment intent id is required");
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      throw ApiError.badRequest("Payment has not been completed");
    }
    paymentResult = {
      id: intent.id,
      status: intent.status,
      updateTime: new Date().toISOString(),
      email: req.user.email,
    };
    isPaid = true;
  }

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    })),
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount,
    couponCode: cart.coupon?.code || null,
    totalPrice,
    isPaid,
    paidAt: isPaid ? new Date() : undefined,
    statusHistory: [{ status: "pending", note: "Order placed" }],
  });

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      variant.stock -= item.quantity;
    } else {
      product.stock -= item.quantity;
    }
    product.numSold += item.quantity;
    await product.save();
  }

  if (cart.coupon?.code) {
    await Coupon.findOneAndUpdate(
      { code: cart.coupon.code },
      { $inc: { usedCount: 1 }, $push: { usersUsed: req.user._id } }
    );
  }

  cart.items = [];
  cart.coupon = { code: null, discountType: null, discountValue: 0 };
  await cart.save();

  await Notification.create({
    user: req.user._id,
    title: "Order placed successfully",
    message: `Your order ${order.orderNumber} has been placed and is being processed.`,
    type: "order",
    link: `/dashboard/orders/${order._id}`,
  });

  return sendSuccess(res, 201, "Order placed successfully", order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const orders = await Order.find({ user: req.user._id })
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user._id });

  return sendSuccess(res, 200, "Orders fetched successfully", orders, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    throw ApiError.notFound("Order not found");
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw ApiError.forbidden("You do not have access to this order");
  }

  return sendSuccess(res, 200, "Order fetched successfully", order);
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) throw ApiError.notFound("Order not found");
  if (order.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("You do not have access to this order");
  }
  if (!["pending", "processing"].includes(order.orderStatus)) {
    throw ApiError.badRequest("This order can no longer be cancelled");
  }

  order.orderStatus = "cancelled";
  order.cancelReason = req.body.reason || "Cancelled by customer";
  order.statusHistory.push({ status: "cancelled", note: order.cancelReason });
  await order.save();

  return sendSuccess(res, 200, "Order cancelled successfully", order);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  return sendSuccess(res, 200, "Orders fetched successfully", orders, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound("Order not found");

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  order.statusHistory.push({ status, note: note || "" });
  await order.save();

  await Notification.create({
    user: order.user,
    title: "Order status updated",
    message: `Your order ${order.orderNumber} status is now: ${status}.`,
    type: "order",
    link: `/dashboard/orders/${order._id}`,
  });

  return sendSuccess(res, 200, "Order status updated successfully", order);
});

module.exports = {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};

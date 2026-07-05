const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  return sendSuccess(res, 200, "Cart fetched successfully", cart);
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1, color = "", size = "" } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw ApiError.notFound("Product not found");
  }

  let availableStock = product.stock;
  if (variantId) {
    const variant = product.variants.id(variantId);
    if (!variant) throw ApiError.notFound("Product variant not found");
    availableStock = variant.stock;
  }

  if (availableStock < quantity) {
    throw ApiError.badRequest(`Only ${availableStock} items in stock`);
  }

  const cart = await getOrCreateCart(req.user._id);

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      String(item.variantId || "") === String(variantId || "")
  );

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      variantId: variantId || null,
      name: product.title,
      image: product.images?.[0]?.url || "",
      price,
      color,
      size,
      quantity,
    });
  }

  await cart.save();

  return sendSuccess(res, 200, "Item added to cart", cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (quantity < 1) {
    throw ApiError.badRequest("Quantity must be at least 1");
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    throw ApiError.notFound("Cart item not found");
  }

  item.quantity = quantity;
  await cart.save();

  return sendSuccess(res, 200, "Cart item updated", cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    throw ApiError.notFound("Cart item not found");
  }

  cart.items.pull(req.params.itemId);
  await cart.save();

  return sendSuccess(res, 200, "Item removed from cart", cart);
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  cart.coupon = { code: null, discountType: null, discountValue: 0 };
  await cart.save();

  return sendSuccess(res, 200, "Cart cleared successfully", cart);
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon || !coupon.isValid()) {
    throw ApiError.badRequest("Invalid or expired coupon code");
  }

  if (coupon.usersUsed.some((u) => u.toString() === req.user._id.toString())) {
    throw ApiError.badRequest("You have already used this coupon");
  }

  const cart = await getOrCreateCart(req.user._id);

  if (cart.subtotal < coupon.minPurchaseAmount) {
    throw ApiError.badRequest(`Minimum purchase of $${coupon.minPurchaseAmount} required for this coupon`);
  }

  cart.coupon = {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  };

  await cart.save();

  return sendSuccess(res, 200, "Coupon applied successfully", cart);
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.coupon = { code: null, discountType: null, discountValue: 0 };
  await cart.save();

  return sendSuccess(res, 200, "Coupon removed", cart);
});

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
};

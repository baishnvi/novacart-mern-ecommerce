const Coupon = require("../models/Coupon");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  return sendSuccess(res, 200, "Coupons fetched successfully", coupons);
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const existing = await Coupon.findOne({ code: req.body.code?.toUpperCase() });
  if (existing) throw ApiError.conflict("A coupon with this code already exists");

  const coupon = await Coupon.create(req.body);
  return sendSuccess(res, 201, "Coupon created successfully", coupon);
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw ApiError.notFound("Coupon not found");

  Object.keys(req.body).forEach((key) => (coupon[key] = req.body[key]));
  await coupon.save();

  return sendSuccess(res, 200, "Coupon updated successfully", coupon);
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw ApiError.notFound("Coupon not found");

  await coupon.deleteOne();
  return sendSuccess(res, 200, "Coupon deleted successfully");
});

// @desc    Validate a coupon code (customer facing, without applying)
// @route   GET /api/coupons/validate/:code
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
  if (!coupon || !coupon.isValid()) {
    throw ApiError.badRequest("Invalid or expired coupon code");
  }

  return sendSuccess(res, 200, "Coupon is valid", {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minPurchaseAmount: coupon.minPurchaseAmount,
  });
});

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };

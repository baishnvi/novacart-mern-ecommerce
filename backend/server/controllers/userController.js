const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  if (req.file) {
    if (user.avatar?.publicId) await deleteFromCloudinary(user.avatar.publicId);
    const result = await uploadToCloudinary(req.file.buffer, "novacart/avatars");
    user.avatar = { url: result.secure_url, publicId: result.public_id };
  }

  await user.save({ validateBeforeSave: false });

  return sendSuccess(res, 200, "Profile updated successfully", { user: user.toSafeObject() });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.unauthorized("Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshTokens = [];
  await user.save();

  return sendSuccess(res, 200, "Password changed successfully. Please log in again.");
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return sendSuccess(
    res,
    200,
    "Users fetched successfully",
    users.map((u) => u.toSafeObject()),
    { page, limit, total, totalPages: Math.ceil(total / limit) }
  );
});

// @desc    Update user role / status (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");

  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save({ validateBeforeSave: false });

  return sendSuccess(res, 200, "User updated successfully", { user: user.toSafeObject() });
});

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");

  await user.deleteOne();

  return sendSuccess(res, 200, "User deleted successfully");
});

module.exports = { updateProfile, changePassword, getUsers, updateUser, deleteUser };

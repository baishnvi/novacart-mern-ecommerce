const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort("displayOrder name");
  return sendSuccess(res, 200, "Categories fetched successfully", categories);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) throw ApiError.notFound("Category not found");
  return sendSuccess(res, 200, "Category fetched successfully", category);
});

const createCategory = asyncHandler(async (req, res) => {
  let image = { url: "", publicId: "" };
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "novacart/categories");
    image = { url: result.secure_url, publicId: result.public_id };
  }
  const category = await Category.create({ ...req.body, image });
  return sendSuccess(res, 201, "Category created successfully", category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound("Category not found");

  if (req.file) {
    if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
    const result = await uploadToCloudinary(req.file.buffer, "novacart/categories");
    category.image = { url: result.secure_url, publicId: result.public_id };
  }

  Object.keys(req.body).forEach((key) => (category[key] = req.body[key]));
  await category.save();

  return sendSuccess(res, 200, "Category updated successfully", category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound("Category not found");

  if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
  await category.deleteOne();

  return sendSuccess(res, 200, "Category deleted successfully");
});

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

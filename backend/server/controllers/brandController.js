const Brand = require("../models/Brand");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true }).sort("name");
  return sendSuccess(res, 200, "Brands fetched successfully", brands);
});

const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true });
  if (!brand) throw ApiError.notFound("Brand not found");
  return sendSuccess(res, 200, "Brand fetched successfully", brand);
});

const createBrand = asyncHandler(async (req, res) => {
  let logo = { url: "", publicId: "" };
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "novacart/brands");
    logo = { url: result.secure_url, publicId: result.public_id };
  }
  const brand = await Brand.create({ ...req.body, logo });
  return sendSuccess(res, 201, "Brand created successfully", brand);
});

const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw ApiError.notFound("Brand not found");

  if (req.file) {
    if (brand.logo?.publicId) await deleteFromCloudinary(brand.logo.publicId);
    const result = await uploadToCloudinary(req.file.buffer, "novacart/brands");
    brand.logo = { url: result.secure_url, publicId: result.public_id };
  }

  Object.keys(req.body).forEach((key) => (brand[key] = req.body[key]));
  await brand.save();

  return sendSuccess(res, 200, "Brand updated successfully", brand);
});

const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw ApiError.notFound("Brand not found");

  if (brand.logo?.publicId) await deleteFromCloudinary(brand.logo.publicId);
  await brand.deleteOne();

  return sendSuccess(res, 200, "Brand deleted successfully");
});

module.exports = { getBrands, getBrandBySlug, createBrand, updateBrand, deleteBrand };

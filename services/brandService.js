var slugify = require("slugify");
const BrandModel = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc Get list of brands
// @route GET /api/v1/brands
// @access Public

exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find({}).skip(skip).limit(limit);

  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc Get specific brand
// @route GET /api/v1/categories/:id
// @access Public

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc Create a new brand
// @route POST /api/v1/categories
// @access private

exports.createBrand = asyncHandler(async (req, res) => {
  const name = req.body.name;
  try {
    const brand = await BrandModel.create({ name, slug: slugify(name) });
    res.status(201).json({ data: brand });
  } catch (err) {
    res.status(400).send(err);
  }
});

// @desc Update specific brand
// @route PUT /api/v1/categories/:id
// @access Privet

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    // res.status(404).json({ msg: `No brand for this id ${id}` });
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc delete specific brand
// @route delete /api/v1/categories/:id
// @access Privet

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    // res.status(404).json({ msg: `No brand for this id ${id}` });
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ msg: `delete successful` });
});

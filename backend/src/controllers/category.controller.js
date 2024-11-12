import { Category } from "../models/categories.model.js";
import { ApiError } from "../utils/ApiError.js";
import { APiResponse as ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res
      .status(400)
      .json(ApiError(new ApiError(400, "Category Name is required")));
  }
  const isExistingCategory = await Category.findOne({ name });
  if (isExistingCategory) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Category already exists"));
  }
  const category = await Category.create({
    name,
    description,
    createdBy: req.user._id,
  });
  if (!category) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Failed to create category"));
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "Category created", category));
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    return res.status(404).json(new ApiResponse(404, "No categories found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Categories found", categories));
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json(new ApiResponse(404, "Category not found"));
  }
  return res.status(200).json(new ApiResponse(200, "Category found", category));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json(new ApiResponse(404, "Category not found"));
  }
  category.name = name || category.name;
  category.description = description || category.description;
  await category.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Category updated", category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json(new ApiResponse(404, "Category not found"));
  }
  await category.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, "Category deleted", category));
});

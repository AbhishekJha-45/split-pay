import Router from "express";
import verifyRequest from "../middleware/verifyRequest.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();
router.use(verifyRequest);
router.route("/").post(createCategory).get(getCategories).patch(updateCategory);

router
  .route("/:id")
  .get(verifyRequest, getCategory)
  .delete(deleteCategory);

export default router;

import { Router } from "express";
import {
  createPayment,
  createRepo,
  deletePayment,
  getPayment,
  getPayments,
  getRepo,
  updatePayment,
  updatePaymentStatus,
  userPaymentsDetails,
} from "../controllers/payment.controller.js";
import verifyRequest from "../middleware/verifyRequest.js";
const router = Router();

router.route("/payments-detail").get(verifyRequest, userPaymentsDetails);
router.route("/").post(verifyRequest, createPayment);
router.route("/").get(verifyRequest, getPayments);
router.route("/:id").get(verifyRequest, getPayment);
router.route("/:id").delete(verifyRequest, deletePayment);
router.route("/:id").patch(verifyRequest, updatePayment);
router.route("/status/update/:id").patch(verifyRequest, updatePaymentStatus);

router
  .route("/repo")
  .post(verifyRequest, createRepo)
  .get(verifyRequest, getRepo);
export default router;

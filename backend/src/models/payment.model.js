import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    persons: [
      {
        person: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: false,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);

export default Payment;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      pattern: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minLength: [10, "Message must be at least 10 characters long"],
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createMessage = asyncHandler(async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (
      [name, email, message].some(
        (field) => field === undefined || field === null || field.trim() === ""
      )
    ) {
      return res
        .status(400)
        .json(new APiResponse(400, "All fields are required"));
    }
    const createdMessage = await Message.create({
      userId: req.user._id,
      name,
      email,
      message,
    });

    if (!createdMessage) {
      return res
        .status(500)
        .json(new APiResponse(500, "Failed to create message :("));
    }

    return res
      .status(201)
      .json(
        new APiResponse(201, "Message created successfully", createdMessage)
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error?.message || "Failed to create message"));
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user._id });
    return res
      .status(200)
      .json(new APiResponse(200, "Messages fetched successfully", messages));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error?.message || "Failed to fetch messages"));
  }
});

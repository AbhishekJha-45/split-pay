import { asyncHandler } from "../utils/asyncHandler.js";
import { APiResponse as ApiResponse } from "../utils/ApiResponse.js";
import Payment from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Repo } from "../models/Repo.model.js";
export const createPayment = asyncHandler(async (req, res) => {
  const { amount, note, users, category } = req.body;
  if (!amount || !users) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Amount, note, and users are required", null));
  }

  const splitedAmount = amount / users.length;
  const persons = users.map((user) => ({
    person: user,
    amount: splitedAmount,
  }));

  const newPayment = await Payment.create({
    user: req.user._id,
    persons,
    totalAmount: amount,
    note: note || "",
    category: category || null,
  });

  // Update debt and total debt for each user
  for (const user of users) {
    await User.findByIdAndUpdate(
      user,
      {
        $inc: { totalDebt: splitedAmount },
        $push: { debt: { person: req.user._id, amount: splitedAmount } },
      },
      { new: true, useFindAndModify: false }
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Payment created", newPayment));
});

export const getPayments = asyncHandler(async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ user: req.user._id }, { "persons.person": req.user._id }],
    })
      .populate({
        path: "persons.person",
        select: "name email",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, "Payments retrieved", payments));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message, null));
  }
});

export const getPayment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      return res
        .status(400)
        .json(new ApiError(400, "Payment ID is required", null));
    }
    const payment = await Payment.findById(id).populate({
      path: "persons.person",
      select: "name email",
    });
    if (!payment) {
      return res.status(404).json(new ApiError(404, "Payment not found", null));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Payment retrieved", payment));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message, null));
  }
});

export const updatePayment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, note, users } = req.body;

    if (!id) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Payment ID is required", null));
    }

    const updateFields = {};
    if (amount) updateFields.totalAmount = amount;
    if (note) updateFields.note = note;
    if (users) {
      const splitedAmount = amount / users.length;
      const persons = users.map((user) => ({
        person: user,
        amount: splitedAmount,
      }));
      updateFields.persons = persons;

      // Update debt and total debt for each user
      for (const user of users) {
        await User.findByIdAndUpdate(
          user,
          {
            $inc: { totalDebt: splitedAmount },
            $push: { debt: { person: req.user._id, amount: splitedAmount } },
          },
          { new: true, useFindAndModify: false }
        );
      }
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, updateFields, {
      new: true,
      useFindAndModify: false,
    });

    if (!updatedPayment) {
      return res.status(404).json(new ApiError(404, "Payment not found", null));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Payment updated", updatedPayment));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message, null));
  }
});

export const deletePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Payment ID is required", null));
  }
  const payment = await Payment.findById(id);
  if (!payment) {
    return res.status(404).json(new ApiError(404, "Payment not found", null));
  }
  await Payment.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Payment deleted successfully", null));
});

export const userPaymentsDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found", null));
  }

  // Find payments where the current user is in the persons list but not the creator
  const payments = await Payment.find({
    "persons.person": req.user._id,
    user: { $ne: req.user._id },
  })
    .populate({ path: "persons.person", select: "name email" })
    .populate({ path: "user", select: "name" });

  let totalAmountToPay = 0;
  const usersToPay = {};

  payments.forEach((payment) => {
    payment.persons.forEach((person) => {
      if (person.person._id.toString() === req.user._id.toString()) {
        totalAmountToPay += person.amount;
        if (!usersToPay[payment.user._id]) {
          usersToPay[payment.user._id] = {
            name: payment.user.name,
            amount: 0,
          };
        }
        usersToPay[payment.user._id].amount += person.amount;
      }
    });
  });

  const usersToPayArray = Object.keys(usersToPay).map((key) => ({
    userId: key,
    name: usersToPay[key].name,
    amount: usersToPay[key].amount,
  }));

  return res.status(200).json(
    new ApiResponse(200, "User payments analysis", {
      totalAmountToPay,
      usersToPay: usersToPayArray,
    })
  );
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiError(400, "Payment ID is required"));
  }

  const payment = await Payment.findById(id);
  if (!payment) {
    return res.status(404).json(new ApiError(404, "Payment not found"));
  }

  payment.status = "completed";
  payment.markModified("status");
  await payment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Payment status updated", payment));
});

export const createRepo = asyncHandler(async (req, res) => {
  const { name, description, users } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Name and description are required", null));
  }
  const existingRepo = await Repo.findOne({ createdBy: req.user._id });
  if (existingRepo) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Repository already exists", null));
  }

  const newRepo = await Repo.create({
    name,
    description,
    users: users || [],
    createdBy: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "Repository created successfully", newRepo));
});

export const getRepo = asyncHandler(async (req, res) => {
  const repo = await Repo.findOne({ createdBy: req.user._id }).populate({
    path: "users",
    select: "name email",
  });
  if (!repo) {
    return res
      .status(404)
      .json(new ApiError(404, "Repository not found", null));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Repository retrieved successfully", repo));
});

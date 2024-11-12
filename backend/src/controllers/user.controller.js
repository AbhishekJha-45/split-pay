import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const generateTokens = (user) => {
  if (!user) {
    throw new Error("User is required To Generate Tokens");
  }
  const access_token = user.generateAccessToken();
  const refresh_token = user.generateRefreshToken();
  return { access_token, refresh_token };
};
export const createUser = asyncHandler(async (req, res) => {
  const { username, password, name, email, phone, org, service } = req.body;
  const reqData = { username, password, name, email, phone, org, service };
  if (
    [name, email, username, password, org, service].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const isExistingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (isExistingUser) {
    return res
      .status(400)
      .json(
        new APiResponse(400, "User with same email or username already exists")
      );
  }

  await User.create({
    ...reqData,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
  });
  const createdUser = await User.findOne({ email: email.toLowerCase() }).select(
    "-password -refresh_token"
  );
  if (!createdUser) {
    return res
      .status(500)
      .json(new APiResponse(500, "Failed to create User :("));
  }
  return res
    .status(201)
    .json(new APiResponse(201, "User created successfully", createdUser));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    return res.status(404).json(new APiResponse(404, "User not found"));
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(400).json(new APiResponse(400, "Invalid Password"));
  }
  const { access_token, refresh_token } = generateTokens(user);
  if (!(access_token || refresh_token)) {
    return res
      .status(500)
      .json(new APiResponse(500, "Failed to generate tokens"));
  }
  user.refresh_token = refresh_token;
  await user.save();
  return res.status(200).json(
    new APiResponse(200, "Login Successful", {
      access_token,
      refresh_token,
      _id: user._id,
      email: user.email,
      name: user.name,
    })
  );
});

export const logOutUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    user.refresh_token = "";
    await user.save();
    return res
      .status(200)
      .json(new APiResponse(200, "User Logged Out Successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to logout user"));
  }
});

export const listAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-password -refresh_token -phone -username -debt -createdAt -updatedAt -totalDebt"
    );
    return res.status(200).json(new APiResponse(200, "Users retrieved", users));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

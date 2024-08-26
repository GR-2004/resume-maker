import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.util.js";
import { supabase } from "../utils/supabase.js";
import bcrypt from "bcryptjs";

const generateAccessToken = (id, email) => {
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();
    if (user.error) {
      return res.status(500).json(user.error);
    }
    const accessToken = generateAccessToken(userId, user.data.email);
    const refreshToken = generateRefreshToken(userId);

    const { data, error } = await supabase
      .from("user")
      .update({ refreshToken: refreshToken })
      .eq("id", userId);

    if (error && !data) {
      return res.status(500).json("Error while creating Refresh Token");
    }

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if ([name, email, password].some((field) => field?.trim() === "")) {
      return res.status(404).json("All fields are required");
    }

    // Check if user already exists by name or email
    const { data: existedUser, error: existedUserError } = await supabase
      .from("user")
      .select("*")
      .or(`name.eq.${name},email.eq.${email}`)
      .single();

    if (existedUserError && existedUserError.code !== "PGRST116") {
      // Handle any error other than "no rows found"
      return res.status(500).json("Error checking existing user");
    }

    if (existedUser) {
      return res.status(409).json("User and email already exist");
    }

    // Create new user
    const { data: newUser, error: createUserError } = await supabase
      .from("user")
      .insert([{ name, email, password }])
      .select("*")
      .single();

    if (createUserError) {
      return res.status(500).json(createUserError);
    }
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json("Email and password are required");
    }

    
    const { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .single(); 

    
    if (error || !user) {
      return res.status(404).json("User not found");
    }

    
    if (password !== user.password) {
      return res.status(401).json("Password incorrect");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id
    );

    // Remove sensitive information before sending the user object in response
    const { password: _, refreshToken: __, ...loggedInUser } = user;

    // Define cookie options
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax", 
    };

    // Set the cookies and send the response
    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "Logged in successfully", user: loggedInUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Update the user in the database, setting refreshToken to null
    const { error } = await supabase
      .from("user")
      .update({ refreshToken: null })
      .eq("id", req.user.id);

    if (error) {
      throw new Error("Failed to log out user");
    }

    const options = {
      httpOnly: true,
      secure: true, 
    };

    // Clear the JWT cookies and send the response
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  return res.status(200).json(req.user);
};

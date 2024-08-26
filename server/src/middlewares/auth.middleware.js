import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabase.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    

    if (!token) {
      // throw new ApiError(401,"Unauthorized request");
      return res.status(401).json("Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // const user = await User.findById(decodedToken?.id).select(
    //   "-password -refreshToken"
    // );
    const  {data, error} = await supabase.from("user").select("*").eq("id", decodedToken.id).single()
    const user = data
    if (!user) {
      return res.status(401).json("Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json(error);
  }
};

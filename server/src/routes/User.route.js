import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUser,
} from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/getUser").get(verifyJWT, getUser);

export default router;

import { Router } from "express";
import {
  getResume,
  saveResume,
  getResumeFromId,
} from "../controllers/Resume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/getResumeFromId").get(getResumeFromId);
router.route("/getResume").get(verifyJWT, getResume);
router.route("/saveResume").post(verifyJWT, upload.single("image"), saveResume);

export default router;

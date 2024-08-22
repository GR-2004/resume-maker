import { Resume } from "../models/Resume.model.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.util.js";

export const getResume = async (req, res) => {
  try {
    if (!req?.user?.resumeId) {
      return res.status(404).json({ message: "resumeId not found" });
    }
    const resume = await Resume.findById(req.user.resumeId);
    return res.status(200).json(resume);
  } catch (error) {
    return res
      .status(500)
      .json(
        { message: "something went wrong while fetching resume details" },
        error
      );
  }
};

export const getResumeFromId = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }
    const resume = await Resume.findById(id);
    return res.status(200).json(resume);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong while fetching resume details" });
  }
};

export const saveResume = async (req, res) => {
  try {
    const {
      name,
      college,
      email,
      phone,
      experience,
      github,
      linkedin,
      skills,
      projects,
    } = req.body;

    // Parse projects from JSON string to object
    let parsedProjects = [];
    try {
      parsedProjects = JSON.parse(projects);
    } catch (e) {
      return res.status(400).json({ error: "Invalid format for projects" });
    }

    // Handle file upload if necessary
    const imageUrl = req.file ? req.file.path : null;

    const image = await uploadOnCloudinary(imageUrl);
    console.log("image: ", image)

    const resume = new Resume({
      name,
      college,
      email,
      phone,
      experience,
      github,
      linkedin,
      skills,
      projects: parsedProjects,
      image: image,
    });

    const savedResume = await resume.save();
    console.log("savedResume", savedResume);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.resumeId = savedResume._id;
    await user.save();

    res.status(200).json(savedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

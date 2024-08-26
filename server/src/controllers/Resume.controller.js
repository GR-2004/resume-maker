import { uploadOnCloudinary } from "../utils/Cloudinary.util.js";
import { supabase } from "../utils/supabase.js";

export const getResume = async (req, res) => {
  try {
    if (!req?.user?.resumeId) {
      return res.status(404).json({ message: "resumeId not found" });
    }
    const { data, error } = await supabase
      .from("resume")
      .select("*")
      .eq("id", req.user.resumeId)
      .single();
    if (error) {
      return res.status(500).json(error);
    }
    console.log(data);
    return res.status(200).json(data);
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
    // const resume = await Resume.findById(id);
    const { data: resumeData, error: resumeError } = await supabase
      .from("resume")
      .select("*")
      .eq("id", id)
      .single();
    if (resumeError) {
      return res.status(500).jsno(resumeError);
    }
    return res.status(200).json(resumeData);
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

    if (req.user.resumeId) {
      const { data, error } = await supabase
        .from("resume")
        .update({
          name: name,
          email: email,
          phone: phone,
          experience: experience,
          github: github,
          linkedin: linkedin,
          skills: skills,
          projects: parsedProjects,
          image: image,
        })
        .select("*")
        .eq("id", req.user.resumeId)
        .single();

      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json(data);
    }

    // Insert the resume into the Supabase table
    const { data: savedResume, error: savedError } = await supabase
      .from("resume") // Your table name
      .insert([
        {
          name,
          college,
          email,
          phone,
          experience,
          github,
          linkedin,
          skills,
          projects: parsedProjects,
          image,
        },
      ])
      .select("*")
      .single();

    if (savedError) {
      return res.status(500).json(savedError);
    }

    const { data: userData, error: userError } = await supabase
      .from("user")
      .update({ resumeId: savedResume.id })
      .eq("id", req.user.id)
      .select("*")
      .single();
    if (userError) {
      return res.status(500).json(userError);
    }

    return res.status(200).json(savedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const test = async (req, res) => {
  try {
    const { data, error } = await supabase.from("resume").select("*");
    console.log("data", data);
    console.log("error", error);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};

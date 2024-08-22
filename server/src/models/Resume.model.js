import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});

const ResumeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  college: {
    type: String,
  },
  skills: {
    type: String,
  },
  experience: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  projects: [projectSchema],
});

export const Resume = mongoose.model("Resume", ResumeSchema);

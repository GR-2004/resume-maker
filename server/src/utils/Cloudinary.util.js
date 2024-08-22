import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Ensure the file path is absolute
    const absoluteFilePath = path.resolve(localFilePath);

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(absoluteFilePath, {
      resource_type: "auto",
    });

    // Remove file from local storage after successful upload
    fs.unlinkSync(absoluteFilePath);

    return response.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    // Clean up file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

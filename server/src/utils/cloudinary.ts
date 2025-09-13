import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { env } from "../config/env.js";
dotenv.config();

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath: string) => {
  try {
    if (!localPath) {
      return null;
    }

    const result = await cloudinary.uploader.upload(localPath);
    return result.secure_url;
  } catch (error) {
    return null;
  } finally {
    if (localPath && fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }
};

export { uploadOnCloudinary };

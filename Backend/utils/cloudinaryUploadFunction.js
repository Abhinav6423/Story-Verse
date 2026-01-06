import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary
 * @param {Object} file - multer file object
 * @param {String} folder - cloudinary folder name
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (file, folder = "uploads") => {
  if (!file) {
    throw new Error("File is required for upload");
  }

  const base64 = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

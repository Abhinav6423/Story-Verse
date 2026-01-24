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
    // Optimization during upload:
    transformation: [
      { width: 1000, crop: "limit" }, // Resize only if larger than 1000px
      { quality: "auto" },            // Apply auto-compression
      { fetch_format: "auto" }        // Convert to modern formats
    ]
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

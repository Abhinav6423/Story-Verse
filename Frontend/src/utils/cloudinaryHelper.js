// src/utils/cloudinaryHelper.js

/**
 * Optimizes Cloudinary URLs on the fly
 * @param {string} url - The original Cloudinary URL
 * @param {number} width - Target width (default 400px for cards)
 * @param {string} mode - 'thumb' for cards, 'avatar' for profile pics
 */
export const getOptimizedUrl = (url, width = 400, mode = 'thumb') => {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url; // Skip non-Cloudinary images

  // If already optimized by backend (contains /w_), replace it. 
  // Otherwise, inject params after /upload/
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const baseUrl = url.slice(0, uploadIndex + 8); // includes "/upload/"
  const fileName = url.slice(uploadIndex + 8).replace(/w_\d+,/, ""); // Remove existing width if present

  // Transformations: 
  // w_{width} : Resize to exact width
  // f_auto   : Use best format (WebP/AVIF)
  // q_auto   : Optimize quality
  // c_fill   : Crop to fill aspect ratio (prevents distortion)
  // g_auto   : Focus on the most important part (faces/objects)
  const params = `w_${width},f_auto,q_auto,c_fill,g_auto`;

  return `${baseUrl}${params}/${fileName}`;
};

/**
 * Generates a tiny blur placeholder
 */
export const getBlurPlaceholder = (url) => {
    return getOptimizedUrl(url, 30, 'thumb').replace("q_auto", "q_10,e_blur:1000");
};
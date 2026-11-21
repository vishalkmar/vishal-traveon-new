import { getApiV1Base } from "./apiUrl.js";

/**
 * Uploads an image through our backend (POST /api/v1/upload).
 * The backend holds the Cloudinary credentials, so nothing secret is
 * shipped in the frontend bundle. Requires the admin login token.
 *
 * @param {File} file
 * @param {string} folder Cloudinary folder name, e.g. "blogs"
 * @returns {Promise<string>} secure URL of the uploaded image
 */
export async function uploadImage(file, folder = "general") {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const body = new FormData();
  body.append("folder", folder); // before the file, so multer has it in req.body
  body.append("file", file);

  const response = await fetch(`${getApiV1Base()}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) {
    throw new Error(data.message || `Upload failed (${response.status})`);
  }
  return data.url;
}

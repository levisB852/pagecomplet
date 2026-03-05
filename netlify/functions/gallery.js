const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async () => {
  try {
    const folder = process.env.CLOUDINARY_FOLDER || "Galeria";

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("public_id", "asc")
      .max_results(100)
      .execute();

    const images = result.resources.map((img) => ({
      url: img.secure_url,
      alt: img.public_id,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ images }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
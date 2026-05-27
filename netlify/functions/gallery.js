const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.handler = async function () {
  try {
    const result = await cloudinary.search
      .expression("resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(150)
      .execute();

    const images = result.resources.map(img => ({
      url: img.secure_url,
      alt: img.public_id,
      created_at: img.created_at
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ images })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "No se pudo cargar la galería",
        detail: error.message
      })
    };
  }
};
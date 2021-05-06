const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
	cloud_name:process.env.CLOUDNARY_CLOUD_NAME,
	api_key:process.env.CLOUDNARY_API_KEY,
	api_secret:process.env.CLOUDNARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Yelp-camp',
    allowed_formats:  ['jpeg', 'png', 'jpg']
  },
});

module.exports={
	cloudinary,
	storage
}
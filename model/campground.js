const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const ImageSchema = new Schema ({
	url:String,
	fileName: String
});
ImageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
});
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: [ImageSchema],
	author:{
		type: Schema.Types.ObjectId,
		ref:"User"
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref:'Review'
		}
	]
});

CampgroundSchema.post('findOneDelete', async function(doc){
	if(doc){
		await Review.deleteMany({
			_id:{
				$in: doc.reviews
			}
		})
	}
})

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;

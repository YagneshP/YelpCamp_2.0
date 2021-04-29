const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
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

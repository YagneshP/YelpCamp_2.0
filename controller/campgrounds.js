const Campground = require('../model/campground');
const{cloudinary} = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
//**all campgrounds**//
const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}
//**create campground FORM**//
const renderNewCampFrom = (req, res) => {
  res.render("campgrounds/new");
}
//**create campground**//
const createCampground = async (req, res) => {
	const geoData = 	await	geocodingClient.forwardGeocode({
							query: req.body.campground.location,
							limit: 1
							}).send()
  const newCampground = new Campground({...req.body.campground, author: req.user._id});
	newCampground.image = req.files.map(f => ({url:f.path,filename:f.filename}))
	newCampground.geometry = geoData.body.features[0].geometry;
	await newCampground.save();
	req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${newCampground._id}`);
}

//**show a campground**//
const showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
																		 .populate({
																			path: 'reviews',
																			populate:{path:'author'}
																			})
																		 .populate('author');
	if(!campground){
		req.flash('error', 'Campground not found');
		res.redirect("/campgrounds")
	}
  res.render("campgrounds/show", { campground });
}

//**update a campground**//
const updateCampground = async (req, res) => {

  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
	const imgs = req.files.map(img =>({url:img.path,filename:img.filename}));
	campground.image.push(...imgs);
	await campground.save();
	if (req.body.deleteImage) {
		for (let filename of req.body.deleteImage) {
				await cloudinary.uploader.destroy(process.env.CLOUDNARY_API_KEY,filename);
		}
		await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
}
	req.flash('success','Successfully updated campground');
  res.redirect(`/campgrounds/${campground._id}`);
}

//**delete a campground**//
const deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
	req.flash('success','Successfully deleted campground');
  res.redirect("/campgrounds");
}

//**render edit campground form**//

const renderEditCampFrom = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
	if(!campground){
		req.flash('error', 'Campground not found');
		res.redirect("/campgrounds")
	}
  res.render("campgrounds/edit", { campground });
}

module.exports ={
	index,
	renderNewCampFrom,
	createCampground,
	showCampground,
	updateCampground,
	deleteCampground,
	renderEditCampFrom
}
const Campground = require('../model/campground');

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
  const newCampground = new Campground({...req.body.campground, author: req.user._id});
	newCampground.image = req.files.map(f => ({url: f.path,filename:f.filename}))
	await newCampground.save()
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
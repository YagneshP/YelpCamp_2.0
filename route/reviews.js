const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const{isLoggedIn,isAuthReview,validateReview} = require("../middleware");
const reviews = require("../controller/reviews");

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));
router.delete('/:reviewId',isLoggedIn, isAuthReview,catchAsync( reviews.deleteReview));


module.exports = router;
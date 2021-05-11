const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
			'string.escapeHTML': '{{#label}} must not include HTML!'
	},
	rules: {
			escapeHTML: {
					validate(value, helpers) {
							const clean = sanitizeHtml(value, {
									allowedTags: [],
									allowedAttributes: {},
							});
							if (clean !== value) return helpers.error('string.escapeHTML', { value })
							return clean;
					}
			}
	}
});

const Joi = BaseJoi.extend(extension)

module.exports.validCampgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escapeHTML(),
		price: Joi.number().min(0).required(),
		description: Joi.string().required().escapeHTML(),
		location: Joi.string().required().escapeHTML(),
		// image: Joi.string().required()
	}).required(),
	deleteImage: Joi.array()
});

module.exports.validReviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required().escapeHTML(),
		rating: Joi.number().required().min(1).max(5)
	}).required()
})
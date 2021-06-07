const Joi = require('joi');

module.exports = {
	createValidation: (request) => {
		const createSchema = {
			name : Joi.string(),
			email: Joi.string().required().email().min(3).max(254),
			password: Joi.string().required().min(8).max(16),
			office:Joi.string()
		};

		return Joi.validate(request, createSchema);
	},

	updateValidation: (request) => {
		const updateSchema = {
			name : Joi.string(),
			email: Joi.string().email().max(254).min(3),
			password: Joi.string().min(8).max(16),
			office:Joi.string()
		};

		return Joi.validate(request, updateSchema);
	}
};
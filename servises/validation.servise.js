const { validationResult } = require('express-validator');
const { loginvalidator } = require('../middlewares/validator')

exports.check_validator = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json(errors.array()[0].msg);
	}
	next();
};

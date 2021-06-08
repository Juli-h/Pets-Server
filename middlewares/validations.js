const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required()
})

async function validateUserSchema (req, res, next) {
    try {
        await userSchema.validateAsync({ ...req.body});
        return next();
    }
    catch (err) {
        return res.status(400).json(err);
    }
}


exports.validateUserSchema = validateUserSchema;
const Joi = require('joi');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

const schemas = {
    register: Joi.object({
        name: Joi.string().min(2).max(60).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        address: Joi.string().max(400).optional()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    store: Joi.object({
        name: Joi.string().min(2).max(60).required(),
        email: Joi.string().email().required(),
        address: Joi.string().max(400).optional(),
        ownerId: Joi.number().integer().optional()
    }),

    rating: Joi.object({
        storeId: Joi.number().integer().required(),
        rating: Joi.number().integer().min(1).max(5).required()
    }),

    user: Joi.object({
        name: Joi.string().min(2).max(60).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        address: Joi.string().max(400).optional(),
        role: Joi.string().valid('admin', 'normal', 'store_owner').required()
    })
};

module.exports = { validateRequest, schemas };

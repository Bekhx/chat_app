import * as Joi from 'joi';

const userData = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru', 'uz']}}).required(),
    password: Joi.string().min(6).max(15).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
}).unknown(true);

const login = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru', 'uz']}}).required(),
    password: Joi.string().min(6).max(15).required()
}).unknown(true);

const id = Joi.object({
    room: Joi.number().required()
})

export { userData, login, id };
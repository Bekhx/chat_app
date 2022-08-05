import * as Joi from "joi";

const chatData = Joi.object({
    interlocutorEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'ru', 'uz']}}).required()
})

const room = Joi.object({
    room: Joi.string().uuid().required()
})

export { chatData, room };
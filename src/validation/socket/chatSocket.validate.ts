import * as Joi from "joi";

const messageDataSchema = Joi.object({
    interlocutorId: Joi.number().required(),
    room: Joi.string().uuid().required(),
    date: Joi.date().required(),
    message: Joi.string().required(),
    file: Joi.any()
})

export { messageDataSchema };
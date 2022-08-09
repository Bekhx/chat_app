import * as Joi from "joi";

const messageDataSchema = Joi.object({
    interlocutorId: Joi.number().required(),
    room: Joi.string().uuid().required(),
    message: Joi.string().required()
})

const fileDataSchema = Joi.object({
    interlocutorId: Joi.number().required(),
    room: Joi.string().uuid().required(),
    extension: Joi.string(),
    file: Joi.any()
})

export { messageDataSchema, fileDataSchema };
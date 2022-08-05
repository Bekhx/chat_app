import { ErrorEnum } from "../models/enums/error.enum";

export const errorHandler = (err, req, res, next) => {

    if(err.error && err.error.details) {
        let errors = {};
        for (const item of err.error.details) {
            errors[`${item.context.key}`] = item.message;
        }

        res.status(422).json({status: 422, message: ErrorEnum.invalidData, errors: errors});
    } else {
        next();
    }

};
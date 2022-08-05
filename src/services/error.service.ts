import StatusCodes from "http-status-codes";
import { ErrorEnum } from "../models/enums/error.enum";

export class ErrorService {

    static error (res, errors: any, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = null): any {
        console.log(errors, statusCode, message);
        if (!errors) errors = ErrorEnum.invalidData;

        res.status(statusCode).send({
            status: statusCode,
            message: message ?? ErrorEnum.invalidData,
            errors: errors.errors ? errors.errors : errors
        });
    }

    static validationError(res: any, error: any) {
        let valid = {};

        for (const item of error) {
            valid[`${item.context.key}`] = item.message;
        }

        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            status: StatusCodes.UNPROCESSABLE_ENTITY, message: ErrorEnum.invalidData, errors: valid
        })
    }

}
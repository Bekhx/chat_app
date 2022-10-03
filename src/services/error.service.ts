import StatusCodes from "http-status-codes";
import { ErrorEnum } from "../models/enums/error.enum";

export class ErrorService {

    static error (res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { status: number; message: any; errors: any; }): void; new(): any; }; }; }, errors: any, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message: any = null): any {
        console.log(errors, statusCode, message);
        if (!errors) errors = ErrorEnum.invalidData;

        res.status(statusCode).send({
            status: statusCode,
            message: message ?? ErrorEnum.invalidData,
            errors: errors.errors ? errors.errors : errors
        });
    }

}
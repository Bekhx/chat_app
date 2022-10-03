import { ErrorEnum } from "../models/enums/error.enum";

export const errorHandler = (err: { error: { details: any; }; }, req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: number; message: ErrorEnum; errors: {}; }): void; new(): any; }; }; }, next: () => void) => {

    if(err.error && err.error.details) {
        const errors: {[index: string]:any} = {}
        for (const item of err.error.details) {
            errors[`${item.context.key}`] = item.message;
        }

        res.status(422).json({status: 422, message: ErrorEnum.invalidData, errors});
    } else {
        next();
    }

};
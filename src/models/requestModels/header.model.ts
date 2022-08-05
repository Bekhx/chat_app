import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export interface IRequiredHeaders extends ValidatedRequestSchema {

    [ContainerTypes.Headers]: {
        authorization: string,
    }

}
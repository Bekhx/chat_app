import { ContainerTypes } from 'express-joi-validation'
import { IRequiredHeaders } from './header.model';

export interface IValidatedRequestQuery<T> extends IRequiredHeaders {
    [ContainerTypes.Query]: T
}

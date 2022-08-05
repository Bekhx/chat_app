import { ContainerTypes } from 'express-joi-validation'
import { IRequiredHeaders } from './header.model';

export interface IValidatedRequestBody<T> extends IRequiredHeaders {
    [ContainerTypes.Body]: T
}

import { ContainerTypes } from 'express-joi-validation'
import { IRequiredHeaders } from './header.model';

export interface IValidatedRequestParams<T> extends IRequiredHeaders {
    [ContainerTypes.Params]: T
}
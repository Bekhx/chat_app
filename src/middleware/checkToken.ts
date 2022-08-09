import StatusCodes from 'http-status-codes';
import { ErrorEnum } from "../models/enums/error.enum";
import { ErrorService } from "../services/error.service";
import { IRequiredHeaders } from "../models/requestModels/header.model";
import { UserRepository } from "../repository/user.repository";
import { IValidatedRequest} from "../models/requestModels/validatedRequest.model";
import { TokenService } from "../services/token.service";

export const checkApiToken = async (req: IValidatedRequest<IRequiredHeaders>, res, next) => {

    let authorization: string | null = null;

    try {
        if (req.headers && req.headers.authorization) {
            authorization = req.headers.authorization
        }

        if (!authorization) return ErrorService.error(res, ErrorEnum.authorization, StatusCodes.UNAUTHORIZED);

        const userId = await TokenService.getUserIdByToken(authorization);

        if (!userId) return ErrorService.error(res, ErrorEnum.unauthorized, StatusCodes.UNAUTHORIZED);

        const user = await UserRepository.getUserById(userId);

        if (!user) {
            ErrorService.error(res, ErrorEnum.unauthorized, StatusCodes.UNAUTHORIZED);
        } else {
            req.userId = user.id;
            next();
        }

    } catch (error) {
        ErrorService.error(res, ErrorEnum.unauthorized, StatusCodes.UNAUTHORIZED);
    }
}
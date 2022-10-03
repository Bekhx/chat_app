import StatusCodes from 'http-status-codes';
import { ErrorEnum } from "../models/enums/error.enum";
import { ErrorService } from "../services/error.service";
import { IRequiredHeaders } from "../models/requestModels/header.model";
import { AuthRepository } from "../repository/auth.repository";
import { IValidatedRequest} from "../models/requestModels/validatedRequest.model";
import { TokenService } from "../services/token.service";

export const checkApiToken = async (req: IValidatedRequest<IRequiredHeaders>, res: any, next: () => void) => {
    try {
        const accessToken: string = req.headers.authorization;

        if (!accessToken) return ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED, ErrorEnum.authorization);

        const userData = await TokenService.verifyAccessToken(accessToken);

        if (!userData) return ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED, ErrorEnum.unauthorized);

        const user = await AuthRepository.getUserById(userData.id);

        if (!user) {
            ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED, ErrorEnum.unauthorized);
        } else {
            req.userId = user.id;
            next();
        }

    } catch (error) {
        ErrorService.error(res, error, error.status, error.message);
    }
}
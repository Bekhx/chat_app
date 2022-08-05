import { IValidatedRequest } from "../models/requestModels/validatedRequest.model";
import { IValidatedRequestBody } from "../models/requestModels/validatedRequestBody.model";
import { ErrorService } from "../services/error.service";
import { ChatRepository } from "../repository/chat.repository";
import { v4 as uuidv4 } from 'uuid';
import {IChat, ICreateChat, ICreateChatParams, IRoom} from "../models/interfaces/chat.model";
import StatusCodes from "http-status-codes";
import {IValidatedRequestParams} from "../models/requestModels/validatedRequestParams.model";
import {ErrorEnum} from "../models/enums/error.enum";

export class ChatController {
    static async create(req: IValidatedRequest<IValidatedRequestBody<ICreateChat>>, res: any) {
        try {

            let interlocutor = await ChatRepository.checkInterlocutorByEmail(req.body.interlocutorEmail);

            if (!interlocutor) return ErrorService.error(res, `User by email ${req.body.interlocutorEmail} not found!`, StatusCodes.CONFLICT);

            let response: IChat;
            //Here we check the chat for existence. If a chat exists, return that chat.
            let chat = await ChatRepository.getChat({ userId: req.userId, interlocutorId: interlocutor.id});

            if (!!chat) {
                response = {
                    interlocutor,
                    room: chat.room
                }

                return res.send(response);
            }

            let params: ICreateChatParams = {
                userId: req.userId,
                interlocutorId: interlocutor.id,
                room: uuidv4()
            };
            //Create a chat for this user and for the interlocutor
            let chatData: IRoom = await ChatRepository.createChat(params);
            await ChatRepository.createChatForInterlocutor(params);

            response = {
                interlocutor,
                room: chatData.room
            }

            return res.send(response);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async list(req: IValidatedRequest<any>, res: any) {
        try {

            let chats = await ChatRepository.getChats(req.userId);

            return res.send(chats);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async getChat(req: IValidatedRequest<IValidatedRequestParams<IRoom>>, res: any) {
        try {
            let isUserChat = await ChatRepository.checkRoom(req.params.room, req.userId);

            if (!isUserChat.exists) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND, ErrorEnum.incorrectRoom);

            let chatMessage = await ChatRepository.getChatMessages(req.params.room);

            return res.send(chatMessage);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }
}
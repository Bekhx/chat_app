import { Socket } from "socket.io";
import ISocket from "../../models/interfaces/socket.model";
import { TokenService } from "../../services/token.service";
import {IMessage, IMessageSend } from "../../models/interfaces/chat.model";
import { SocketRepository } from "../../repository/socket/chatSocket.repository";
import { messageDataSchema } from "../../validation/socket/chatSocket.validate";
import { SocketEventsEnum } from "../../models/enums/socket.enum";

global.onlineUsers = new Map();

export class ChatSocket implements ISocket {

    handleConnection(socket: Socket) {

        socket.on(SocketEventsEnum.DISCONNECT, () => {
            global.onlineUsers.forEach((value, key) => {
                if (value === socket.id) {
                    global.onlineUsers.delete(key);
                }
            })
        })

        socket.on(SocketEventsEnum.MSG_SEND, async (messageData: IMessageSend) => {
            try {

                await messageDataSchema.validateAsync(messageData);

                let message: IMessage = await SocketRepository.saveMessage(messageData, socket.data.userId);

                let interlocutorSocketId = global.onlineUsers.get(messageData.interlocutorId);
                if (interlocutorSocketId) {
                    socket.to(interlocutorSocketId).emit(SocketEventsEnum.MSG_RECEIVE, message);
                }

            } catch (error) {
                socket.emit(SocketEventsEnum.ERROR, error.message);
                console.error(error.message);
            }
        });

    }

    async middlewareImplementation(socket: Socket, next) {
        try {
            if (!socket.handshake.headers.authorization) return next(new Error('authorization is required!'));

            let userId = await TokenService.getUserIdByToken(socket.handshake.headers.authorization);

            if (!userId) return next(new Error('unauthorized!'));

            global.onlineUsers.set(userId, socket.id);

            socket.data.userId = userId;
            next();

        } catch (error) {
            console.error(error);
            return next(error);
        }
    }
}

export default ChatSocket;
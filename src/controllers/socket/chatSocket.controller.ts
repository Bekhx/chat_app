import { Socket } from "socket.io";
import ISocket from "../../models/interfaces/socket.model";
import { TokenService } from "../../services/token.service";
import { IChatParticipants, IFileMessage, IFileSend, IMessageSend } from "../../models/interfaces/chat.model";
import { SocketRepository } from "../../repository/socket/chatSocket.repository";
import { fileDataSchema, messageDataSchema } from "../../validation/socket/chatSocket.validate";
import { SocketEventsEnum } from "../../models/enums/socket.enum";
import { ChatRepository } from "../../repository/chat.repository";
import { ErrorEnum } from "../../models/enums/error.enum";
import { writeFile } from "fs";
import { v4 as uuidv4 } from 'uuid';
import {IUserId} from "../../models/interfaces/user.model";
import { redisClient } from "../../database/redis";

// @ts-ignore
global.onlineUsers = new Map();

export class ChatSocket implements ISocket {

    handleConnection(socket: Socket) {

        socket.on(SocketEventsEnum.DISCONNECT, async () => {
            const onlineUsers = await redisClient.hGetAll('onlineUsers');

            const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);

            await redisClient.hDel('onlineUsers', userId.toString());
        })

        socket.on(SocketEventsEnum.MSG_SEND, async (data) => {
            try {
                const messageData: IMessageSend = JSON.parse(data);
                await messageDataSchema.validateAsync(messageData);

                const chatData: IChatParticipants = {
                    userId: socket.data.userId,
                    interlocutorId:messageData.interlocutorId
                };

                const chat = await ChatRepository.getChat(chatData);

                if (!chat) throw new Error(ErrorEnum.interlocutorNotFound);

                if (messageData.room !== chat.room) throw new Error(ErrorEnum.incorrectRoom);

                const message = await SocketRepository.saveMessage(messageData, socket.data.userId);

                const interlocutorSocketId = await redisClient.hGet('onlineUsers', messageData.interlocutorId.toString());

                if (interlocutorSocketId) {
                    socket.to(interlocutorSocketId).emit(SocketEventsEnum.MSG_RECEIVE, message);
                }

            } catch (error) {
                socket.emit(SocketEventsEnum.ERROR, error.message);
                console.error(error);
            }
        });

        socket.on(SocketEventsEnum.MSG_SEND_FILE, async (fileData: IFileSend) => {
            try {
                await fileDataSchema.validateAsync(fileData);

                const chatData: IChatParticipants = {
                    userId: socket.data.userId,
                    interlocutorId: fileData.interlocutorId
                };

                const chat = await ChatRepository.getChat(chatData);
                if (!chat) throw new Error(ErrorEnum.interlocutorNotFound);

                if (fileData.room !== chat.room) throw new Error(ErrorEnum.incorrectRoom);

                const fileName = uuidv4();
                const filePath = `http://${process.env.HOST}:${process.env.PORT}/files/${fileName}.${fileData.extension}`;
                const pathForWriteFile = `./uploads/${fileName}.${fileData.extension}`;

                const messageToSave: IFileMessage = {
                    userId: socket.data.userId,
                    interlocutorId: fileData.interlocutorId,
                    filePath,
                    room: fileData.room
                }

                const message = await SocketRepository.saveFilePath(messageToSave);

                writeFile(pathForWriteFile, fileData.file, (err) => {
                    if (err) throw new Error(err.message);
                });

                const interlocutorSocketId = await redisClient.hGet('onlineUsers', fileData.interlocutorId.toString());

                if (interlocutorSocketId) {
                    socket.to(interlocutorSocketId).emit(SocketEventsEnum.MSG_RECEIVE, message);
                }
            } catch (error) {
                socket.emit(SocketEventsEnum.ERROR, error.message);
                console.error(error);
            }
        });

    }

    async middlewareImplementation(socket: Socket, next: (arg0?: Error) => void) {
        try {
            if (!socket.handshake.headers.authorization) return next(new Error(ErrorEnum.authorization));

            const userData = await TokenService.verifyAccessToken(socket.handshake.headers.authorization);

            if (!userData) return next(new Error(ErrorEnum.unauthorized));

            await redisClient.hSet('onlineUsers', userData.id, socket.id);

            socket.data.userId = userData.id;
            next();

        } catch (error) {
            console.error(error);
            return next(error);
        }
    }
}

export default ChatSocket;
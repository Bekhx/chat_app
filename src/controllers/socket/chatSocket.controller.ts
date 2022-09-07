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

                let chatData: IChatParticipants = {
                    userId: socket.data.userId,
                    interlocutorId:messageData.interlocutorId
                };

                let chat = await ChatRepository.getChat(chatData);
                if (!chat) throw new Error(ErrorEnum.interlocutorNotFound);

                if (messageData.room !== chat.room) throw new Error(ErrorEnum.incorrectRoom);

                let message = await SocketRepository.saveMessage(messageData, socket.data.userId);

                let interlocutorSocketId = global.onlineUsers.get(messageData.interlocutorId);
                if (interlocutorSocketId) {
                    socket.to(interlocutorSocketId).emit(SocketEventsEnum.MSG_RECEIVE, message);
                }

            } catch (error) {
                socket.emit(SocketEventsEnum.ERROR, error.message);
                console.error(error.message);
            }
        });

        socket.on(SocketEventsEnum.MSG_SEND_FILE, async (fileData: IFileSend) => {
            try {
                await fileDataSchema.validateAsync(fileData);

                let chatData: IChatParticipants = {
                    userId: socket.data.userId,
                    interlocutorId: fileData.interlocutorId
                };

                let chat = await ChatRepository.getChat(chatData);
                if (!chat) throw new Error(ErrorEnum.interlocutorNotFound);

                if (fileData.room !== chat.room) throw new Error(ErrorEnum.incorrectRoom);

                let fileName = uuidv4();
                let filePath = `http://${process.env.HOST}:${process.env.PORT}/files/${fileName}.${fileData.extension}`;
                let pathForWriteFile = `./uploads/${fileName}.${fileData.extension}`;

                let messageToSave: IFileMessage = {
                    userId: socket.data.userId,
                    interlocutorId: fileData.interlocutorId,
                    filePath,
                    room: fileData.room
                }

                let message = await SocketRepository.saveFilePath(messageToSave);

                writeFile(pathForWriteFile, fileData.file, (err) => {
                    if (err) throw new Error(err.message);
                });

                let interlocutorSocketId = global.onlineUsers.get(fileData.interlocutorId);
                if (interlocutorSocketId) {
                    socket.to(interlocutorSocketId).emit(SocketEventsEnum.MSG_RECEIVE, message);
                }
            } catch (error) {
                socket.emit(SocketEventsEnum.ERROR, error.message);
                console.error(error);
            }
        });

    }

    async middlewareImplementation(socket: Socket, next) {
        try {
            if (!socket.handshake.headers.authorization) return next(new Error(ErrorEnum.authorization));

            let userData = await TokenService.verifyAccessToken(socket.handshake.headers.authorization);

            if (!userData) return next(new Error(ErrorEnum.unauthorized));

            global.onlineUsers.set(userData.id, socket.id);

            socket.data.userId = userData.id;
            next();

        } catch (error) {
            console.error(error);
            return next(error);
        }
    }
}

export default ChatSocket;
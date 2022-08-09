export interface IChat extends IRoom {
    interlocutor: IInterlocutor
}

export interface IInterlocutor {
    id: number,
    firstName: string,
    lastName: string,
    email: string
}

export interface ICreateChat {
    interlocutorEmail: string
}

export interface ICreateChatParams extends IChatParticipants, IRoom {
    id?: number
}

export interface IChatParticipants {
    userId: number,
    interlocutorId: number,
}

export interface IRoom {
    room: string
}

export interface IMessageSend extends IRoom {
    interlocutorId: number,
    message: string
}

export interface IFileSend extends IRoom {
    interlocutorId: number,
    extension: string,
    file: any
}

export interface IFileMessage extends IRoom {
    userId: number,
    interlocutorId: number,
    filePath: string
}

export interface IMessage extends IRoom {
    id: number,
    from: number,
    to: number,
    message: string | null,
    filePath: string | null,
    date: string
}

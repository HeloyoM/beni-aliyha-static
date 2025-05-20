export default interface IMessage {
    message_id: string;
    sender_id: string;
    sender_role: string;
    sender_email: string;
    description: string;
    created_at: string;
    is_public: boolean;
    replies?: IReply[]
}

export interface IReply {
    reply_id: string;
    replier_id: string;
    reply_sender_email: string;
    reply_description: string;
    reply_created_at: string;
    reply_sender_role: string;
}
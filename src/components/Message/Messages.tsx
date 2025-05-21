
import { useState, useEffect } from 'react';
import { Avatar, Box, Typography, CircularProgress, Alert, TextField, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, formatDistanceToNow } from 'date-fns';
import { deleteMessage, getMessages, postMessage, replyToMessage } from '../../api/message';
import { Send, Trash } from 'lucide-react';
// import { io, Socket } from 'socket.io-client';
import { useAppUser } from '../../context/AppUser.context';
import IMessage, { IReply } from '../../interfaces/IMessage.interface';
import MessageForm from './MessageForm';
import { ChatBubbleOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Styled components for enhanced UI
const MessageContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    transition: 'transform 0.2s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));


const MessageHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

const SenderAvatar = styled(Avatar)(({ theme }) => ({
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '1rem',

}));

const MessageText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    whiteSpace: 'pre-line', // Preserve line breaks
    fontSize: '0.95rem',
    lineHeight: 1.6
}));

const MessageDate = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    display: 'block',
    textAlign: 'right',
    fontStyle: 'italic'
}));

const ReplyContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '8px',
    backgroundColor: theme.palette.action.hover,
    marginTop: theme.spacing(2),
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    marginLeft: theme.spacing(2),
}));

const ReplyHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

const ReplyAvatar = styled(Avatar)(({ theme }) => ({
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
}));

const ReplyText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    whiteSpace: 'pre-line',
    fontSize: '0.9rem'
}));

const ReplyDate = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: '0.7rem',
    display: 'block',
    textAlign: 'right',
}));

const ReplyForm = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
    background: theme.palette.background.default,
    borderRadius: '8px',
    padding: theme.spacing(1),
}));



const Messages = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<{ [messageId: string]: string }>({});

    const { t } = useTranslation();

    // const [socket, setSocket] = useState<Socket | null>(null);


    const { user } = useAppUser();

    // useEffect(() => {
    //     // Initialize Socket.IO connection
    //     const newSocket = io(); // Connect to the server at the same origin
    //     setSocket(newSocket);

    //     // Clean up the socket connection when the component unmounts
    //     return () => {
    //         newSocket.disconnect();
    //     };
    // }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login or handle unauthenticated state
                return;
            }
            const response = await getMessages()

            const data = response.data as any;

            if (response.status < 200) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }

            setMessages(data);
            setLoading(false);

        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching messages.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    /*useEffect(() => {
        if (!socket) return;
        socket.on('newMessage', (newMessage: any) => {
            setMessages(prevMessages => [newMessage, ...prevMessages]);
        });

        // Listen for new replies
        socket.on('newReply', (payload: any) => {
            const { messageId, reply } = payload;
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.message_id === messageId ? { ...msg, replies: [...(msg.replies || []), reply] } : msg
                )
            );
        });

        return () => {
            socket.off('newMessage');
            socket.off('newReply');
        };
    }, [socket]);*/

    const handleReplyChange = (messageId: string, text: string) => {
        setReplyText(prev => ({
            ...prev,
            [messageId]: text,
        }));
    };

    const handleSendReply = async (messageId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect
                return;
            }
            const payload = {
                description: replyText[messageId],
                messageId
            }
            const response = await replyToMessage(payload)

            const data = response.data as any;

            if (response.status < 200) {
                throw new Error(`Failed to send reply: ${response.status}`);
            }

            /* Emit the reply to the server using Socket.IO
            if (socket) {
                socket.emit('sendReply', { messageId, reply: response.data });
            }*/

            setMessages((prevMessages: any) =>
                prevMessages.map((msg: any) =>
                    msg.message_id === messageId ? { ...msg, replies: [...(msg.replies || []), data.reply] } : msg
                )
            );
            setReplyText(prev => ({ ...prev, [messageId]: '' }));
        } catch (err: any) {
            setError(err.message || 'An error occurred while sending the reply.');
        }
    };


    const handleDeleteMessage = async (id: string) => {
        try {
            const response = await deleteMessage(id)

            if (response.status === 200) {
                setMessages(prev => prev.filter(m => m.message_id !== id));
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
            setError('Could not delete the message.');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress size={60} />
            </div>
        );
    }

    if (error) {
        return (
            <Alert severity="error" variant="outlined" style={{ marginTop: '20px' }}>
                {error}
            </Alert>
        );
    }

    if (messages.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 2,
                    maxWidth: '800px',
                    margin: '0 auto',
                    backgroundColor: '#f9f9f9',
                    borderRadius: 3,
                    border: '1px dashed #ccc',
                    boxShadow: 1,
                }}
            >
                <ChatBubbleOutline sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />

                <Typography variant="h6" color="text.primary" gutterBottom>
                    {t('messages.no_messages')}
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={3}>
                    {t('messages.default_message')}
                </Typography>

                <MessageForm messages={messages} setError={setError} setMessages={setMessages} />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f0f4f8', py: 4, marginTop: '2%', maxWidth: '800px', margin: '0 auto', px: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {t('messages.messages_title')}
            </Typography>

            <MessageForm messages={messages} setError={setError} setMessages={setMessages} />

            {messages.map((message: IMessage) => (
                <MessageContainer key={message.message_id}>
                    <MessageHeader>
                        <SenderAvatar>{message.sender_email?.[0]?.toUpperCase()}</SenderAvatar>
                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                            {message.sender_email}
                        </Typography>
                    </MessageHeader>
                    <MessageText>
                        {message.description}
                    </MessageText>
                    <MessageDate>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })} ({format(new Date(message.created_at), 'PPPpp')})
                    </MessageDate>





                    {message.sender_id === user?.id && (
                        <IconButton
                            aria-label="delete"
                            onClick={() => {
                                if (window.confirm(t('messages.confirm_delete'))) {
                                    handleDeleteMessage(message.message_id);
                                }
                            }}
                            size="small"
                            sx={{ ml: 1 }}
                        >
                            <Trash fontSize="small" />
                        </IconButton>
                    )}




                    {message.replies && message.replies.length > 0 ? (
                        <Box>
                            <Typography variant="subtitle2" style={{ marginTop: '1rem', fontWeight: 'bold' }}>Replies:</Typography>
                            {message.replies.map((reply: IReply) => (
                                <ReplyContainer key={`${reply.replier_id}-${reply.reply_created_at}`}>
                                    <ReplyHeader>
                                        <ReplyAvatar>{reply.reply_sender_email[0]}</ReplyAvatar>
                                        <Typography variant="body2" style={{ fontWeight: '600' }}>
                                            {reply.reply_sender_email}
                                        </Typography>
                                    </ReplyHeader>
                                    <ReplyText>{reply.reply_description}</ReplyText>
                                    <ReplyDate>{formatDistanceToNow(new Date(reply.reply_created_at), { addSuffix: true })}  ({format(new Date(reply.reply_created_at), 'PPPpp')})</ReplyDate>
                                </ReplyContainer>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            {t('messages.no_replies')}
                        </Typography>
                    )}

                    <ReplyForm>
                        <TextField
                            fullWidth
                            placeholder={t('messages.placeholder_reply')}
                            value={replyText[message.message_id] || ''}
                            onChange={(e) => handleReplyChange(message.message_id, e.target.value)}
                            variant="outlined"
                            size="small"
                            multiline
                            style={{ flex: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSendReply(message.message_id)}
                            disabled={!replyText[message.message_id]?.trim()}
                            style={{ padding: '0.5rem' }}
                        >
                            <Send size={16} />
                        </Button>
                    </ReplyForm>
                </MessageContainer>
            ))}
        </Box>
    );
};

export default Messages;
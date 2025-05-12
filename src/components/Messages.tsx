
import { useState, useEffect } from 'react';
import { Avatar, Box, Typography, CircularProgress, Alert, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, formatDistanceToNow } from 'date-fns';
import { getMessages, postMessage, replyToMessage } from '../api/message';
import { Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { FormControlLabel, Switch } from '@mui/material';
import { useAppUser } from '../context/AppUser.context';

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

const NewMessageForm = styled(Box)(({ theme }) => ({
    margin: theme.spacing(3, 0),
    padding: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '12px',
    backgroundColor: theme.palette.grey[50],
    boxShadow: theme.shadows[1],
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
}))
const Messages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<{ [messageId: string]: string }>({}); // Store reply text for each message
    const [newMessageDescription, setNewMessageDescription] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isPublic, setIsPublic] = useState(false);

    const { canPublishMessages } = useAppUser();

    useEffect(() => {
        // Initialize Socket.IO connection
        const newSocket = io(); // Connect to the server at the same origin
        setSocket(newSocket);

        // Clean up the socket connection when the component unmounts
        return () => {
            newSocket.disconnect();
        };
    }, []);

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

    useEffect(() => {
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
    }, [socket]);

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

            if (response.status < 200) {
                throw new Error(`Failed to send reply: ${response.status}`);
            }

            // Emit the reply to the server using Socket.IO
            if (socket) {
                socket.emit('sendReply', { messageId, reply: response.data });
            }

            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.message_id === messageId ? { ...msg, replies: [...(msg.replies || []), response.data] } : msg
                )
            );
            setReplyText(prev => ({ ...prev, [messageId]: '' }));
        } catch (err: any) {
            setError(err.message || 'An error occurred while sending the reply.');
        }
    };

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect
                return;
            }

            const response = await postMessage({ description: newMessageDescription, isPublic })

            const data = response.data as any;
            if (response.status < 200) {
                throw new Error(`Failed to send message: ${response.status}`);
            }

            // Emit the new message to the server using Socket.IO
            if (socket) {
                socket.emit('sendMessage', data.newMessage);
            }

            setMessages(prevMessages => [data.newMessage, ...prevMessages]);
            setNewMessageDescription('');
        } catch (err: any) {
            setError(err.message || 'An error occurred while sending the message.');
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
            <MessageContainer>
                <Typography variant="body1" color="text.secondary" align="center">
                    No messages yet.
                </Typography>
            </MessageContainer>
        );
    }

    return (
        <Box sx={{ marginTop: '2%', maxWidth: '800px', margin: '0 auto', px: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Messages
            </Typography>

            <NewMessageForm>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#1a5235' }}>
                    Send a New Message
                </Typography>

                <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={newMessageDescription}
                    onChange={(e) => setNewMessageDescription(e.target.value)}
                    variant="outlined"
                    size="medium"
                    multiline
                    minRows={3}
                />

                {canPublishMessages && <FormControlLabel
                    control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
                    label="Make Public"
                />}

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessageDescription.trim()}
                        startIcon={<Send size={16} />}
                    >
                        Send
                    </Button>
                </Box>

            </NewMessageForm>

            {messages.map((message: any) => (
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

                    {message.replies && message.replies.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" style={{ marginTop: '1rem', fontWeight: 'bold' }}>Replies:</Typography>
                            {message.replies.map((reply: any) => (
                                <ReplyContainer key={reply.replier_id}>
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
                    )}
                    <ReplyForm>
                        <TextField
                            fullWidth
                            placeholder="Write a reply..."
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
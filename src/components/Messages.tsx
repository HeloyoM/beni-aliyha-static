
import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Box, Typography, CircularProgress, Alert, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, formatDistanceToNow } from 'date-fns';
import { getMessages, replyToMessage } from '../api/message';
import AppUserContext from '../context/AppUserContext';
import { MessageCircle, Send } from 'lucide-react';

// Styled components for enhanced UI
const MessageContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
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
}));

const MessageText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    whiteSpace: 'pre-line', // Preserve line breaks
}));

const MessageDate = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    display: 'block',
    textAlign: 'right',
}));

const ReplyContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '8px',
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(2),
    borderLeft: `2px solid ${theme.palette.primary.main}`,
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
    alignItems: 'flex-start', // Align items to the start (top in this case)
}));

const Messages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<{ [messageId: string]: string }>({}); // Store reply text for each message
    // const [userEmail, setUserEmail] = useState<string>('');

    const { user } = useContext(AppUserContext)

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

            // Fetch user email
            // const userResponse = await fetch('/user', {  //  Endpoint to get user data
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            // if (userResponse.ok) {
            //     const userData = await userResponse.json();
            //     setUserEmail(userData.email)
            // }

        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching messages.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

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

            const data = response.data as any
            if (response.status < 200) {
                throw new Error(`Failed to send reply: ${response.status}`);
            }

            // Refresh messages after sending a reply - move it later into server code! 
            await fetchMessages();
            setReplyText(prev => ({ ...prev, [messageId]: '' }));

        } catch (err: any) {
            setError(err.message || 'An error occurred while sending the reply.');
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
        <Box sx={{marginTop: '2%'}}>
            <Typography variant="h4" component="h2" gutterBottom style={{ color: '#1a5235' }}>
                Messages
            </Typography>
            {messages.map((message: any) => (
                <MessageContainer key={message.message_id}>
                    <MessageHeader>
                        <SenderAvatar>{message.sender_email[0]}</SenderAvatar>
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
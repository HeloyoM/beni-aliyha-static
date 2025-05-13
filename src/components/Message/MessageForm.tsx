import { Box, Button, FormControlLabel, styled, Switch, TextField, Typography } from "@mui/material";
import { useAppUser } from "../../context/AppUser.context";
import { useState } from "react";
import { Send } from "lucide-react";
import { postMessage } from '../../api/message';
import IMessage from "../../interfaces/IMessage.interface";

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

type Props = {
    setError: React.Dispatch<React.SetStateAction<string | null>>
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
    messages: IMessage[]
}
const MessageForm = ({ messages, setMessages, setError }: Props) => {
    const [newMessageDescription, setNewMessageDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const { canPublishMessages } = useAppUser();

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

            /* Emit the new message to the server using Socket.IO
            if (socket) {
                socket.emit('sendMessage', data.newMessage);
            }*/

            setMessages(prevMessages => [data.newMessage, ...prevMessages]);
            setNewMessageDescription('');
        } catch (err: any) {
            setError(err.message || 'An error occurred while sending the message.');
        }
    };

    return (
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
    )
}

export default MessageForm;
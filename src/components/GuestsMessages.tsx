import React, { useEffect, useState } from 'react';
import { Alert, Box, Paper, Typography, Badge, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { deleteGuestMessage, getGuestMessages } from '../api/message';
import { useAppUser } from '../context/AppUser.context';
import { Trash } from 'lucide-react';
import IMessage from '../interfaces/IMessage.interface';
import { useNavigate } from 'react-router-dom';

const GuestMessages = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [showDescription, setShowDescription] = useState(true);

    const { user } = useAppUser();

    const navigate = useNavigate();

    useEffect(() => {
        // Load visibility preference from localStorage
        const hide = localStorage.getItem('hideGuestDescription');
        setShowDescription(hide !== 'true');
    }, []);

    const handleToggleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = !event.target.checked;
        setShowDescription(checked);
        localStorage.setItem('hideGuestDescription', (!checked).toString());
    };

    useEffect(() => {
        if (!user || user.role_id > 101) return;

        const fetchMessages = async () => {
            try {
                const response = await getGuestMessages();

                const data = response.data as any;
                setMessages(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch messages');
            }
        };

        fetchMessages();
    }, [user]);

    const handleDelte = async (id: string) => {
        try {
            const response = await deleteGuestMessage(id);

            const data = response.data as any;

            const result = messages.filter(m => m.message_id === data.message_id);

            setMessages(result);

        } catch (error: any) {
            setError(error.message)
        }
    }

    if (!user || user.role_id > 101) return null;

    return (
        <Box sx={{ p: 2 }}>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6">Guest Messages</Typography>
                <Badge badgeContent={Boolean(messages.length) ? messages.length : 0} color="secondary">
                    <IconButton onClick={() => setOpen(!open)}>
                        <Notifications />
                    </IconButton>
                </Badge>
            </Box>


            {showDescription && (<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This section displays all the messages submitted by guests through the public form <a style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/guest#contact-us')}>here</a>.
                Admins can review, manage, and remove these messages if needed.
            </Typography>)}

            {showDescription &&<FormControlLabel
                control={
                    <Checkbox
                        checked={!showDescription}
                        onChange={handleToggleDescription}
                        color="primary"
                    />
                }
                label="Don't show this description again"
                sx={{ mt: 1 }}
            />}

            {open && (
                <Paper elevation={2} sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#f5f5f5' }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {messages.length === 0 ? (
                        <Typography>No messages yet.</Typography>
                    ) : (
                        messages.map((msg: any, index: number) => (
                            <Box key={index} sx={{ mb: 2, p: 1, borderBottom: '1px solid #ccc' }}>
                                <Typography variant="subtitle1"><strong>{msg.guest_name}</strong> ({msg.guest_email})</Typography>
                                <Typography variant="body2">{msg.description}</Typography>
                                <Trash color="red" cursor="pointer" onClick={() => handleDelte(msg.id)} />
                            </Box>
                        ))
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default GuestMessages;

import { useEffect, useState } from "react";
import { getMessages } from "../api/message";
import { Paper, Typography } from "@mui/material";

const PublicMessages = () => {
    const [publicMessages, setPublicMessages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPublicMessages = async () => {
            try {
                const response = await getMessages();

                const data = response.data as any;

                const filtered = data.filter((msg: any) => Boolean(msg.is_public));
                setPublicMessages(filtered);
            } catch (error) {
                console.error('Failed to fetch public messages', error);
            }
        };

        fetchPublicMessages();
    }, []);


    return (
        publicMessages.length > 0 ? (
            <>{publicMessages.map((msg, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, mb: 1, backgroundColor: '#fefefe' }}>
                    <Typography variant="body1" color="text.primary">{msg.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        — {msg.user?.name || 'Anonymous'}
                    </Typography>
                </Paper>
            ))}</>
        ) : (
            <Typography variant="body2" color="text.secondary">No public messages yet.</Typography>
        )
    )
}

export default PublicMessages;
import { useEffect, useState } from "react";
import { eventIcons } from "./eventIcons";
import { Button, Select, CardContent, Typography, Grid, Paper, styled, Box, CircularProgress, Card, Chip, CardHeader, Avatar, TextField, FormControl, MenuItem, InputLabel, Alert, FormHelperText, ListItemIcon, ListItemText } from '@mui/material';
import { Star } from 'lucide-react';
import { getCommunityEvents, getEventsTypes } from "../../api/events";
import EventForm from "./EventForm";

interface CommunityEvent {
    id: string;
    description: string;
    created_at: string;
    greg_date: string;
    hebrew_date: string;
    icon: string;
    color: string;
    type: string
    user: {
        name: string;
        id: string;
        email: string;
    };
}

export const Events = () => {
    const [events, setEvents] = useState<CommunityEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getCommunityEvents();

            const data = response.data as any;

            setEvents(data);

        } catch (err) {
            console.error('Failed to fetch happy events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        loading ? (
            <CircularProgress />
        ) : (
            <>
                {events.map(event => (
                    <Grid size={{ xs: 12, md: 4 }} key={event.id}>
                        <Card sx={{ mb: 2, borderLeft: `5px solid ${event.color}` }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: event.color }}>
                                        {eventIcons[event.icon] || <Star />} {/* Fallback icon */}
                                    </Avatar>
                                }
                                title={event.type}
                                subheader={`${event.greg_date} / ${event.hebrew_date}`}
                            />
                            <CardContent>
                                <Typography>{event.description}</Typography>
                            </CardContent>
                        </Card>

                    </Grid>
                ))}
            </>
        )
    )
}

export default Events;
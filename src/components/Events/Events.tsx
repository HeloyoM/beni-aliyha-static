import { useEffect, useState } from "react";
import { eventIcons } from "./eventIcons";
import { Button, Select, CardContent, Typography, Grid, Paper, styled, Box, CircularProgress, Card, Chip, CardHeader, Avatar, TextField, FormControl, MenuItem, InputLabel, Alert, FormHelperText, ListItemIcon, ListItemText } from '@mui/material';
import { Star, PartyPopper } from 'lucide-react';
import { getCommunityEvents, getEventsTypes } from "../../api/events";
import EventForm from "./EventForm";
import { PartyMode } from '@mui/icons-material';
import React from "react";
import { useTranslation } from 'react-i18next';

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

    const { t } = useTranslation();

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

    if (events.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 2,
                    bgcolor: '#f9f9f9',
                    borderRadius: 2,
                    boxShadow: 1,
                    border: '1px dashed #ccc',
                }}
            >
                <PartyMode sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t('events.no_events')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                     {t('events.default_message')}
                </Typography>
            </Box>
        )
    }

    return (
        <React.Fragment>
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
                            <Typography sx={{ fontFamily: 'Sora, sens-serif', fontWeight: 600 }}>{event.description}</Typography>
                        </CardContent>
                    </Card>

                </Grid>
            ))}
        </React.Fragment>
    )
}

export default Events;
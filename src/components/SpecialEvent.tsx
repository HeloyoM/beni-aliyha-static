import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Avatar, Button, useMediaQuery } from '@mui/material';
import { Event, AccessTime, Place, School } from '@mui/icons-material';
import Scp from '../svg/scp.svg';
import { DownloadIcon } from 'lucide-react';


const SpecialEvent = () => {
    const event = {
        image: Scp,
        title: 'Scp',
        date: new Date().toLocaleDateString('en-GB'),
        time: '21:00',
        location: 'Shul',
        description: "הלכות ברכות"
    } as any

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', py: 6 }}>
            <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
                Special Lesson / Event
            </Typography>

            <Grid container justifyContent="center" mt={4}>
                <Grid size={{ xs: 11, sm: 10, md: 8 }}>
                    <Card
                        sx={{
                            display: 'flex',
                            p: 2,
                            boxShadow: 6,
                            borderRadius: 4,
                            background: '#fff',
                        }}
                    >
                        {!isMobile && <Avatar
                            variant="rounded"
                            src={event.image}
                            alt="Event"
                            sx={{ width: '12vw', height: 120, mr: 3 }}
                        />}

                        <CardContent>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {event.title}
                            </Typography>

                            <Grid container spacing={1} alignItems="center">
                                <Grid>
                                    <Event color="primary" />
                                </Grid>
                                <Grid>
                                    <Typography variant="body1">{event.date}</Typography>
                                </Grid>

                                <Grid>
                                    <AccessTime color="action" />
                                </Grid>
                                <Grid>
                                    <Typography variant="body1">{event.time}</Typography>
                                </Grid>

                                <Grid>
                                    <Place color="secondary" />
                                </Grid>
                                <Grid>
                                    <Typography variant="body1">{event.location}</Typography>
                                </Grid>

                                <Grid>
                                    <School color="success" />
                                </Grid>

                            </Grid>

                            <Typography mt={2} variant="body2" color="text.secondary">
                                {event.description}
                            </Typography>

                            <Button
                                variant="contained"
                                disabled
                                startIcon={<DownloadIcon />}
                                href={event.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    mt: 3,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, #007FFF, #00C6FF)',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: '0.3s ease',

                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0059b2, #009ac7)',
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                    },
                                    '&:active': {
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                    }
                                }}
                            >
                                Download This Week’s PDF
                            </Button>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SpecialEvent;

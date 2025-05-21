import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Avatar,
    Button,
    useMediaQuery
} from '@mui/material';
import { Event, AccessTime, Place, School } from '@mui/icons-material';
import Scp from '../svg/scp.svg';
import { DownloadIcon, Repeat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SpecialEvent = () => {
    const event = {
        image: Scp,
        title: 'Scp',
        date: new Date().toLocaleDateString('en-GB'),
        time: '21:00',
        location: 'Shul',
        description: 'הלכות ברכות',
        repeat: true,
        pdfUrl: '#'
    };

    const { t } = useTranslation();


    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #fff8e1, #ffe0b2)', // light orange-yellow gradient
                py: 6
            }}
        >
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                fontWeight="bold"
                color="text.primary"
                sx={{
                    position: 'relative',
                    display: 'inline-block',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '4px',
                        left: 0,
                        bottom: -4,
                        backgroundColor: '#FFA726',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.4s ease-in-out'
                    },
                    '&:hover::after': {
                        transform: 'scaleX(1)'
                    }
                }}
            >
                {t('special_event.section_title')}
            </Typography>

            <Grid container justifyContent="center" mt={4}>
                <Grid size={{ xs: 11, sm: 10, md: 8 }}>
                    <Card
                        sx={{
                            display: 'flex',
                            p: 2,
                            boxShadow: 6,
                            borderRadius: 4,
                            background: '#fff'
                        }}
                    >
                        {!isMobile && (
                            <Avatar
                                variant="rounded"
                                src={event.image}
                                alt="Event"
                                sx={{ width: '12vw', height: 120, mr: 3 }}
                            />
                        )}

                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {event.title}
                            </Typography>

                            <Grid container spacing={1} alignItems="center" mb={2}>
                                <Grid >
                                    <Event color="primary" />
                                </Grid>
                                <Grid >
                                    <Typography variant="body1">{event.date}</Typography>
                                </Grid>
                                {event.repeat && (
                                    <Grid >
                                        <Repeat
                                            style={{
                                                fontSize: 28,
                                                color: '#f57c00',
                                                animation: 'spin 6s linear infinite'
                                            }}
                                        />
                                    </Grid>
                                )}
                                <Grid >
                                    <AccessTime color="action" />
                                </Grid>
                                <Grid >
                                    <Typography variant="body1">{event.time}</Typography>
                                </Grid>

                                <Grid >
                                    <Place color="secondary" />
                                </Grid>
                                <Grid >
                                    <Typography variant="body1">{event.location}</Typography>
                                </Grid>

                                <Grid >
                                    <School color="success" />
                                </Grid>
                                <Grid >
                                    <Typography variant="body1">Learning</Typography>
                                </Grid>
                            </Grid>

                            <Typography mt={1} variant="body2" color="text.secondary">
                                {event.description}
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                href={event.pdfUrl}
                                disabled
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
                                    background: 'linear-gradient(135deg, #FFA726, #FB8C00)',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: '0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #EF6C00, #F57C00)',
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                                    },
                                    '&:active': {
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                {t('special_event.button')}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Keyframes for icon animation */}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </Box>
    );
};

export default SpecialEvent;

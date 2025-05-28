import { Card, CardContent, CardMedia, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import VideoDialog from './VideoDialog';
import { PlayCircle } from 'lucide-react';

const PlayButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    color: 'white',
    fontSize: '4rem',
    opacity: 0.8,
    transition: 'opacity 0.2s ease',
    '&:hover': {
        opacity: 1,
        transform: 'translate(-50%, -50%) scale(1.1)',
    },
}));

const Videos = () => {
    const [openDialog, setOpenDialog] = useState<{ open: boolean; src: string }>({ open: false, src: '' });

    const { t } = useTranslation();

    const isMobile = useMediaQuery('(max-width:600px)');

    const handleVideoClick = useCallback((src: string) => {
        setOpenDialog({ open: true, src });
    }, []);


    const handleCloseDialog = useCallback(() => {
        setOpenDialog({ open: false, src: '' });
    }, []);


    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>
                {t('guest.videos.life_looks_like')}
            </Typography>

            <Grid container spacing={4} justifyContent="center" style={{ width: '100%', padding: '16px' }}>
                {isMobile && <Card
                    sx={{
                        // width: '100%',
                        height: '100vw',
                        minWidth: '350px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
                        },
                        // height: isMobile ? '50vw' : 'auto',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative', // Needed for absolute positioning of button
                    }}
                    onClick={() => handleVideoClick(videoData[0].src)}
                >

                    {/* <CardMedia
                                component="iframe"
                                src={`https://img.youtube.com/vi/${videoData[0].src.split('embed/')[1]}/hqdefault.jpg`} // Get thumbnail
                                title={videoData[0].title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{
                                    aspectRatio: '12/9',
                                    width: '100%',
                                }}
                            /> */}


                    <PlayButton sx={{ color: 'black' }} onClick={() => handleVideoClick(videoData[0].src)}>
                        <PlayCircle style={{ fontSize: 'inherit' }} />
                    </PlayButton>


                    <CardContent>
                        <Typography variant="h6" component="div" align="center" style={{ marginTop: '8px' }}>
                            {videoData[0].title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {videoData[0].caption}
                        </Typography>
                    </CardContent>


                </Card>}
                {!isMobile && videoData.map((video, index) => (
                    <Grid key={index} style={{ display: 'flex', justifyContent: 'center' }}>

                        <Card
                            sx={{
                                width: '100%',
                                minWidth: '482px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
                                },
                                borderRadius: '12px',
                                overflow: 'hidden',
                                position: 'relative', // Needed for absolute positioning of button
                            }}
                            onClick={() => handleVideoClick(video.src)}
                        >

                            <CardMedia
                                component="iframe"
                                src={`https://img.youtube.com/vi/${video.src.split('embed/')[1]}/hqdefault.jpg`} // Get thumbnail
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{
                                    aspectRatio: '12/9',
                                    width: '100%',
                                }}
                            />


                            <PlayButton onClick={() => handleVideoClick(video.src)}>
                                <PlayCircle style={{ fontSize: 'inherit' }} />
                            </PlayButton>


                            <CardContent>
                                <Typography variant="h6" component="div" align="center" style={{ marginTop: '8px' }}>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    {video.caption}
                                </Typography>
                            </CardContent>


                        </Card>
                    </Grid>
                ))}
            </Grid>

            <VideoDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
        </React.Fragment>
    )
}

export default Videos;

const videoData = [
    {
        src: 'https://www.youtube.com/embed/MZbhRNXi3bM', // Example 1
        title: 'title',
        caption: 'some description',
    },
    {
        src: 'https://www.youtube.com/embed/4tFXPbh3RC4', // Example 2
        title: 'title',
        caption: 'some description',
    },
    {
        src: 'https://www.youtube.com/embed/f9u17l6oyuY',  // Example 3
        title: 'title',
        caption: 'some description',
    },
];
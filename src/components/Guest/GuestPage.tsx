
import React, { useCallback, useEffect, useState } from 'react';
import { Fade, Box, Typography, Grid, Card, CardMedia, CardContent, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Snackbar, Accordion, AccordionSummary, AccordionDetails, Container, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../../App.css';
import { useLocation } from 'react-router-dom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { PlayCircle, XCircle, Send, Expand } from 'lucide-react';
import TestimonialsCarousel from './Texti';
import { motion } from 'framer-motion';
// import bgVideoUp from '../assets/videos/2.mp4';
// import bgVideoDown from '../assets/videos/3.mp4';
import { FinalCTASection } from './FinalCTASection';
import LocationMap from '../LocationMap';
import { postGuestMessage } from '../../api/message';
import { useTranslation } from 'react-i18next';
import GuestContactUs from './ContactUs';
import VideoDialog from './VideoDialog';

const GuestSection = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Align items to the center horizontally
    scrollSnapAlign: 'start',
    padding: theme.spacing(2),
    overflow: 'hidden', // To contain full-width children
}));

const ContentBox = styled(Box)(({ theme }) => ({
    maxWidth: '80%',
    margin: '0 auto',
    textAlign: 'center',
}));


function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${width * cols}&h=${height * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

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

const GuestPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState<{ open: boolean; src: string }>({ open: false, src: '' });


    const { t } = useTranslation();

    const isMobile = useMediaQuery('(max-width:600px)');

    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#contact-us') {
            const section = document.getElementById('contact-us');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const handleVideoClick = useCallback((src: string) => {
        setOpenDialog({ open: true, src });
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog({ open: false, src: '' });
    }, []);

    const cards = [
        { icon: '🌱', title: t('guest.community.family_oriented_title'), text: t('guest.community.family_oriented_text') },
        { icon: '🤝', title: t('guest.community.supportive_network_title'), text: t('guest.community.supportive_network_text') },
    ]

    if (!isMobile) {
        cards.push({ icon: '📚', title: t('guest.community.community_great_education_title'), text: t('guest.community.community_great_education_text') })
    }

    return (
        <>
            <Box
                sx={{
                    overflowY: 'auto',
                    height: '100vh',
                    backgroundImage: 'url(/images/aliyah-hero.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center',
                    px: 2,
                }}
            >

                {/* <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={bgVideoDown}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: -2,
                    }}
                /> */}

                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: -1,
                    }}
                />

                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)', p: 3, borderRadius: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                        {t('guest.title.welcome_home')}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {t('guest.title.discover_community')}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    overflowY: 'auto',
                    height: '100vh',
                    scrollSnapType: 'y mandatory',
                }}
            >

                <GuestSection id="pictures" sx={{ justifyContent: 'flex-start', paddingTop: 4 }}>
                    <ImageList
                        sx={{
                            width: '100%',
                            height: '100vh',
                            // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                            transform: 'translateZ(0)',
                        }}
                        rowHeight='auto'
                        gap={1}
                    >
                        {itemData.map((item) => {
                            const cols = item.featured ? 2 : 1;
                            const rows = item.featured ? 2 : 1;

                            return (
                                <ImageListItem key={item.img} cols={cols} rows={rows}>
                                    <img
                                        {...srcset(item.img, 800, 600, rows, cols)}
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                    <ImageListItemBar
                                        sx={{
                                            background:
                                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                        }}
                                        title={item.title}
                                        position="top"
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'white' }}
                                                aria-label={`star ${item.title}`}
                                            >
                                                <StarBorderIcon />
                                            </IconButton>
                                        }
                                        actionPosition="left"
                                    />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>


                </GuestSection>







                <GuestSection id="videos" sx={{ justifyContent: 'flex-start', paddingTop: 4 }}>

                    <Typography variant="h5" gutterBottom>{t('guest.videos.life_looks_like')}</Typography>

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


                </GuestSection>












                <GuestSection id="text-content" >
                    <Box sx={{ py: 6, px: 2, maxWidth: '900px', mx: 'auto' }}>

                        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#0d47a1' }}>
                            {t('guest.content.content_title')}
                        </Typography>

                        <Typography variant="h4" gutterBottom textAlign="center">
                            {t('guest.content.why_move_title')}
                        </Typography>

                        <Typography variant="subtitle1" textAlign="center" sx={{ mb: 4 }}>
                            {t('guest.content.why_move_subtitle')}
                        </Typography>

                        <ContentBox>
                            <Grid container spacing={8}>
                                <Grid >
                                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>{t('guest.content.affordable_housing_title')}</Typography>
                                        <Typography>{t('guest.content.affordable_housing_text')}</Typography>
                                    </Box>
                                </Grid>
                                <Grid >
                                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>{t('guest.content.community_that_cares_title')}</Typography>
                                        <Typography>{t('guest.content.community_that_cares_text')}</Typography>
                                    </Box>
                                </Grid>
                                {!isMobile && <Grid >
                                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>{t('guest.content.great_education_title')}</Typography>
                                        <Typography>{t('guest.content.great_education_text')}</Typography>
                                    </Box>
                                </Grid>}
                            </Grid>

                            {!isMobile && <Box sx={{ textAlign: 'center', mt: 5 }}>
                                <Button variant="contained" size="large" color="primary" href="#contact-us">
                                    {t('guest.content.lets_talk_button')}
                                </Button>
                            </Box>}
                        </ContentBox>
                    </Box>
                </GuestSection>












                <GuestSection id="faq">
                    <Box sx={{ py: 6, px: 2, maxWidth: '800px', mx: 'auto' }}>
                        <Typography variant="h4" gutterBottom textAlign="center">
                            {t('guest.faq.faq_title')}
                        </Typography>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>{t('guest.faq.faq_1_question')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {t('guest.faq.faq_1_answer')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>{t('guest.faq.faq_2_question')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {t('guest.faq.faq_2_answer')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>{t('guest.faq.faq_3_question')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {t('guest.faq.faq_3_answer')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>{t('guest.faq.faq_4_question')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {t('guest.faq.faq_4_answer')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>{t('guest.faq.faq_5_question')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {t('guest.faq.faq_5_answer')}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                </GuestSection>











                <GuestSection id="people">
                    <Box sx={{ py: 6, px: 2 }}>
                        <Typography variant="h4" gutterBottom textAlign="center">
                            {t('guest.testimonials.what_families_are_saying')}
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            <Grid >
                                <Card sx={{ p: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" fontStyle="italic">
                                            {t('guest.testimonials.testimonial1')}
                                        </Typography>
                                        <Typography variant="subtitle2" mt={2} textAlign="right">
                                            {t('guest.testimonials.testimonial_1_author')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid>
                                <Card sx={{ p: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" fontStyle="italic">
                                            {t('guest.testimonials.testimonial2')}
                                        </Typography>
                                        <Typography variant="subtitle2" mt={2} textAlign="right">
                                            {t('guest.testimonials.testimonial_2_author')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {!isMobile && <Grid>
                                <Card sx={{ p: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" fontStyle="italic">
                                            {t('guest.testimonials.testimonial3')}
                                        </Typography>
                                        <Typography variant="subtitle2" mt={2} textAlign="right">
                                            {t('guest.testimonials.testimonial_3_author')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>}
                        </Grid>
                    </Box>

                </GuestSection>











                <GuestSection id="testi">
                    <TestimonialsCarousel />
                </GuestSection>











                <GuestSection id="community" style={{ position: 'relative', overflow: 'hidden' }}>

                    {/* <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        src={bgVideoUp}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: -2,
                        }}
                    /> */}


                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: -1,
                        }}
                    />


                    <Container maxWidth="md" sx={{ py: 8 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Typography variant="h4" gutterBottom textAlign="center" sx={{ color: 'white' }}>
                                {t('guest.community.about_community_title')}
                            </Typography>
                            <Typography variant="body1" textAlign="center" color="white" maxWidth="md" mx="auto">
                                {t('guest.community.about_community_text')}
                            </Typography>

                            {/* <DonationCard /> */}

                        </motion.div>

                        <Grid container spacing={4} mt={4}>
                            {cards.map((item, i) => (
                                <Grid key={i}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 * i }}
                                        viewport={{ once: true }}
                                    >
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                px: 3,
                                                py: 4,
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 3,
                                                boxShadow: 2,
                                                height: '100%',
                                            }}
                                        >
                                            <Typography variant="h3" mb={1}>
                                                {item.icon}
                                            </Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.text}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>


                        {!isMobile && <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Box textAlign="center" mt={6}>
                                <Button variant="contained" href="#pictures">
                                    {t('guest.community.life_button')}
                                </Button>
                            </Box>
                        </motion.div>}
                    </Container>
                </GuestSection>











                <GuestSection id="cta">
                    <FinalCTASection />
                </GuestSection>














                <GuestSection id="location">
                    <LocationMap />
                </GuestSection>















                <GuestSection
                    id="contact-us"
                    sx={{
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        color: 'white',
                        justifyContent: 'flex-start',
                        paddingTop: 4,
                    }}
                >
                    <GuestContactUs />
                </GuestSection>




                <VideoDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} />




            </Box>
        </>
    );
};

export default GuestPage;


const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
        featured: true,
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
        author: '@rollelflex_graphy726',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
        author: '@helloimnik',
    },
    {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
        author: '@nolanissac',
    },
    {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
        author: '@hjrc33',
    },
    {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
        author: '@arwinneil',
        featured: true,
    },
    {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
        author: '@tjdragotta',
    },
    {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
        author: '@katie_wasserman',
    },
    {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
        author: '@silverdalex',
    },
    {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
        author: '@shelleypauls',
    },
    {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
        author: '@peterlaster',
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
        author: '@southside_customs',
    },
];


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
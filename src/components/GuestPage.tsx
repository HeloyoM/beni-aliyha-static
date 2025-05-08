// GuestPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Fade, Box, Typography, Grid, Card, CardMedia, CardContent, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Snackbar, Accordion, AccordionSummary, AccordionDetails, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { PlayCircle, XCircle, Send, Expand } from 'lucide-react';
import TestimonialsCarousel from './Texti';
import { motion } from 'framer-motion';
import bgVideoUp from '../assets/2.mp4';
import bgVideoDown from '../assets/3.mp4';
import { FinalCTASection } from './FinalCTASection';
import LocationMap from './LocationMap';
import WhatsappButton from './WhatsappButton';
import { postGuestMessage } from '../api/message';

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
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name, e.target.value)
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    const handleSubmit = async () => {
        try {
            const response = await postGuestMessage({ description: form.message, email: form.email, name: form.name })

            const data = response.data as any;

            if (response.status < 200) {
                throw new Error(`Failed to send message: ${data.message}`);
            }

            setSuccess(true);

            setOpen(true);
            setForm({ name: "", email: "", message: "" });
        } catch (err: any) {
            setError(err.message || 'An error occurred while sending the message.');
        }
    };

    const handleVideoClick = useCallback((src: string) => {
        setOpenDialog({ open: true, src });
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog({ open: false, src: '' });
    }, []);


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
                        Welcome Home to Israel 🇮🇱
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Discover a thriving Anglo community where you and your family can thrive.
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

                    <Typography variant="h5" gutterBottom>See What Life Looks Like Here 🎥</Typography>

                    <Grid container spacing={4} justifyContent="center" style={{ width: '100%', padding: '16px' }}>
                        {videoData.map((video, index) => (
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
                            Content
                        </Typography>

                        <Typography variant="h4" gutterBottom textAlign="center">
                            Why Move to Israel with Us?
                        </Typography>

                        <Typography variant="subtitle1" textAlign="center" sx={{ mb: 4 }}>
                            You're not just relocating — you're joining a vibrant, warm, English-speaking community that feels like family.
                        </Typography>

                        <ContentBox>
                            <Grid container spacing={4}>
                                <Grid >
                                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>🏠 Affordable Housing</Typography>
                                        <Typography>Live in a beautiful, green area with space to grow — physically and spiritually.</Typography>
                                    </Box>
                                </Grid>
                                <Grid >
                                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>👨‍👩‍👧‍👦 Community That Cares</Typography>
                                        <Typography>From Shabbat meals to carpools, you’re never alone — we’re here for each other.</Typography>
                                    </Box>
                                </Grid>
                                <Grid >
                                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>🎓 Great Education</Typography>
                                        <Typography>Top-tier schools with supportive teachers and values-based learning in English and Hebrew.</Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box sx={{ textAlign: 'center', mt: 5 }}>
                                <Button variant="contained" size="large" color="primary" href="#contact">
                                    Let’s Talk About Your Future in Israel 🇮🇱
                                </Button>
                            </Box>
                        </ContentBox>
                    </Box>
                </GuestSection>







                <GuestSection id="faq">
                    <Box sx={{ py: 6, px: 2, maxWidth: '800px', mx: 'auto' }}>
                        <Typography variant="h4" gutterBottom textAlign="center">
                            Frequently Asked Questions
                        </Typography>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>Is this community religious?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Yes, it’s a warm, inclusive Modern Orthodox community. There’s room for families across the religious spectrum who value tradition and connection.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>Do people speak English?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Absolutely! Most of the community is English-speaking — from shul to schools to neighbors. You won’t feel like a stranger.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>What kind of support is available for new olim?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Everything from helping you find housing, schools, jobs, to making friends. You’ll be paired with a family and guided by locals who’ve been through it all.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>What about schools and education?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    There are excellent schools for all ages — with small classes, bilingual support, and a warm approach that balances Torah and academics.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<Expand />}>
                                <Typography>Can we come visit first?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Yes! We’d love to host you for a Shabbat or weekday visit. It’s the best way to see if this feels like home. Just reach out and we’ll make it happen.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                </GuestSection>







                <GuestSection id="people">
                    <Box sx={{ py: 6, px: 2 }}>
                        <Typography variant="h4" gutterBottom textAlign="center">
                            What Families Are Saying
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            <Grid>
                                <Card sx={{ p: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" fontStyle="italic">
                                            "We thought moving to Israel would be hard. But this community made it feel like we were coming home. Our kids are thriving."
                                        </Typography>
                                        <Typography variant="subtitle2" mt={2} textAlign="right">
                                            — Sarah R., NJ to Israel
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid>
                                <Card sx={{ p: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" fontStyle="italic">
                                            "I never imagined we’d feel so supported. From day one, we had friends, mentors, and a place at every Shabbat table."
                                        </Typography>
                                        <Typography variant="subtitle2" mt={2} textAlign="right">
                                            — Daniel T., NY to Israel
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid>
                                <Card sx={{ p: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" fontStyle="italic">
                                            "It’s not just a community. It’s a family. Moving here changed our lives — and our children’s future."
                                        </Typography>
                                        <Typography variant="subtitle2" mt={2} textAlign="right">
                                            — Leah M., Chicago to Israel
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
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
                                About the Community
                            </Typography>
                            <Typography variant="body1" textAlign="center" color="white" maxWidth="md" mx="auto">
                                Our community is built on shared values of family, growth, and connection. Whether you're looking
                                for meaningful friendships, excellent education, or a slower, more purposeful pace of life —
                                this is a place where you can truly feel at home. 🏡
                            </Typography>

                            <WhatsappButton />
                        </motion.div>

                        <Grid container spacing={4} mt={4}>
                            {[
                                { icon: '🌱', title: 'Family-Oriented', text: 'Activities and values that nurture every age.' },
                                { icon: '🤝', title: 'Supportive Network', text: 'A community that supports you from day one.' },
                                { icon: '📚', title: 'Great Education', text: 'Access to inspiring schools and programs.' },
                            ].map((item, i) => (
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


                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Box textAlign="center" mt={6}>
                                <Button variant="contained" href="#pictures">
                                    See Life in the Community
                                </Button>
                            </Box>
                        </motion.div>
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

                    <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, color: 'white' }}>
                        Contact Us
                    </Typography>

                    <Fade in timeout={1000}>


                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            id="contact"
                            sx={{ py: 8, px: 2, backgroundColor: "#f9f9f9" }}
                        >
                            <Box maxWidth="sm" mx="auto" component={Paper} elevation={6} p={4} borderRadius={4}>
                                <Typography variant="h4" gutterBottom textAlign="center">
                                    Contact Us
                                </Typography>
                                <Typography variant="body1" textAlign="center" mb={3}>
                                    Have a question or want to learn more? Send us a message!
                                </Typography>
                                <Box component="form" onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Message"
                                        name="message"
                                        multiline
                                        rows={4}
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Box textAlign="center" mt={2}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            endIcon={<Send />}
                                            component={motion.button}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Send
                                        </Button>
                                    </Box>

                                </Box>
                            </Box>

                            <Snackbar
                                open={open}
                                autoHideDuration={3000}
                                onClose={() => setOpen(false)}
                                message="Message sent! We'll get back to you soon."
                            />
                        </Box>
                    </Fade>



                </GuestSection>


                <Dialog open={openDialog.open} onClose={handleCloseDialog} fullWidth maxWidth="lg">
                    <DialogTitle>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            Video
                            <IconButton onClick={handleCloseDialog} size="large">
                                <XCircle style={{ fontSize: 'inherit' }} />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent>
                        {openDialog.open && ( // Conditionally render the iframe
                            <iframe
                                width="100%"
                                height="500px" // Adjust as needed
                                src={openDialog.src}
                                title="Video Player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ border: 'none' }}
                            />
                        )}
                    </DialogContent>

                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={4000}
                        onClose={() => setSnackbarOpen(false)}
                        message="Message sent successfully!"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    />

                </Dialog>
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
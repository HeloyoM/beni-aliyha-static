// GuestPage.tsx
import React, { useCallback, useState } from 'react';
import { Fade, Box, Typography, Grid, Card, CardMedia, CardContent, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { PlayCircle, XCircle, Send } from 'lucide-react';
// Styled component for the sections
const GuestSection = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Align items to the center horizontally
    scrollSnapAlign: 'start',
    padding: theme.spacing(2),
    overflow: 'hidden', // To contain full-width children
}));

const ImageGrid = styled(Grid)(({ theme }) => ({
    padding: theme.spacing(0), // Remove padding from the grid itself
    width: '100%', // Make the grid take full width
    maxWidth: '100%', // Ensure it doesn't exceed
    margin: '0', // Remove default margins
}));

const FullWidthCard = styled(Card)({
    width: '100%',
    maxWidth: '100%',
    boxShadow: 'none', // Remove default card shadow
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content within the card (if needed)
});

const FullHeightIframe = styled('iframe')({
    width: '100%',
    height: '100%',
    border: 'none', // Optional: remove the iframe border
});

const FullWidthCardMedia = styled(CardMedia)({
    width: '100%',
    height: 'auto',
});
const FullHeightVideoContainer = styled(Box)({
    width: '100%',
    height: '100%', // Make the container take full height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
const VideoContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const ContentBox = styled(Box)(({ theme }) => ({
    maxWidth: '80%',
    margin: '0 auto',
    textAlign: 'center',
}));

const ContactFormBox = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    maxWidth: '90%',
    margin: '0 auto',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
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
const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5, 3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius,
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'scale(1.03)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
        transform: 'scale(1)',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    },
    display: 'flex', // Use flexbox for icon alignment
    alignItems: 'center',
    gap: theme.spacing(1), // Space between text and icon
}));
const GuestPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState<{ open: boolean; src: string }>({ open: false, src: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        message: '',
    });

    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/'); // Navigate to the root path
    };

    const handleVideoClick = useCallback((src: string) => {
        setOpenDialog({ open: true, src });
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog({ open: false, src: '' });
    }, []);

    console.log(videoData.map(v => v.src.split('embed/')[1]))

    const validateForm = () => {
        let isValid = true;
        const newErrors: typeof formErrors = { name: '', email: '', message: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Data:', formData);
            setFormData({ name: '', email: '', message: '' });
            setSnackbarOpen(true);

            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setSnackbarOpen(true);
                setFormData({ name: '', email: '', message: '' });
            }, 1000);
        } else {
            // Form is invalid, errors are displayed
            console.log("Form has errors", formErrors)
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error message when the user starts typing
        setFormErrors({ ...formErrors, [name]: '' });
    };

    return (
        <Box
            sx={{
                overflowY: 'auto',
                height: '100vh',
                scrollSnapType: 'y mandatory',
            }}
        >

            <GuestSection id="pictures" sx={{ justifyContent: 'flex-start', paddingTop: 4 }}>
                <Button variant="outlined" onClick={handleBackToLogin} sx={{ mt: 2 }}>
                    Back
                </Button>


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
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Content
                </Typography>
                <ContentBox>
                    <Typography variant="body1" paragraph>
                        This is some example text content for the guest page. By using the `ContentBox`,
                        we ensure the text has a reasonable reading width on various screen sizes.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Feel free to add more paragraphs and information here. The `GuestSection`
                        will ensure this section takes up a full viewport height.
                    </Typography>
                </ContentBox>
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

                <Fade in timeout={800}>
                    <Box sx={{width: '79%', minHeight: '650px'}}>
                        <Paper elevation={4} sx={{ borderRadius: 3, p: 3, backgroundColor: '#ffffffdd' }}>

                            <ContactFormBox onSubmit={handleSubmit}>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="name"
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'black' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.7)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#f44336', // Keep error message color
                                        },
                                    }}
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'black' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.7)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#f44336', // Keep error message color
                                        },
                                    }}
                                />
                                <TextField
                                    label="Message"
                                    multiline
                                    rows={4}
                                    aria-label="message"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    error={!!formErrors.message}
                                    helperText={formErrors.message}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'black' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.7)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#f44336', // Keep error message color
                                        },
                                    }}
                                />
                                <StyledButton type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : <>
                                        <Send />
                                        Send Message
                                    </>}
                                </StyledButton>
                            </ContactFormBox>
                        </Paper>
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
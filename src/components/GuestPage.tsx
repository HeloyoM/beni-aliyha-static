// GuestPage.tsx
import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../App.css';
import { useNavigate } from 'react-router-dom';

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

const GuestPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/'); // Navigate to the root path
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
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Pictures
                </Typography>
                <ImageGrid container spacing={0} justifyContent="center">
                    {/* Example image cards - replace with your actual data */}
                    {[1, 2, 3, 4].map((index) => (
                        <Grid key={index}>
                            <FullWidthCard>
                                <FullWidthCardMedia
                                    image={`https://via.placeholder.com/1920x1080?text=Picture ${index + 1}`}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Caption for picture {index + 1}
                                    </Typography>
                                </CardContent>
                            </FullWidthCard>
                        </Grid>
                    ))}
                </ImageGrid>
            </GuestSection>

            <GuestSection id="videos" sx={{ justifyContent: 'flex-start', paddingTop: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Videos
                </Typography>
                <FullHeightVideoContainer>
                    {/* Example embedded video - replace with your actual videos */}
                    <FullHeightIframe

                        src={`https://www.youtube.com/embed/MZbhRNXi3bM`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></FullHeightIframe>
                </FullHeightVideoContainer>
                {/* Add more VideoContainer components for additional videos */}
            </GuestSection>

            <GuestSection id="text-content">
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

            <GuestSection id="contact-us">
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Contact Us
                </Typography>
                <ContactFormBox>
                    <TextField label="Name" variant="outlined" fullWidth required />
                    <TextField label="Email" type="email" variant="outlined" fullWidth required />
                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Send Message
                    </Button>
                </ContactFormBox>
            </GuestSection>
        </Box>
    );
};

export default GuestPage;
import React from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

// Styled component for the welcome text
const WelcomeText = styled(Typography)(({ theme }) => ({
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        fontSize: '2.5rem',
    },
}));

// Styled component for the application name
const AppNameText = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: '600',
    color: '#6495ED',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.75rem',
    }
}));

// Styled component for the guest button
const GuestButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(2, 4),
    fontSize: '1.1rem',
    fontWeight: 'bold',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
    position: 'relative', // For stacking above the blur
}));

const WelcomeScreen = () => {
    const navigate = useNavigate();

    const handleGuestButtonClick = () => {
        navigate('/guest');
    };
    return (
        <Box
            sx={{
                // Full viewport height and width
                height: '100vh',
                width: '100vw',
                // Background image with blur
                backgroundImage: ('../../../../shule.webp'), // Replace with your image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // Flexbox for centering content
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // Position absolutely to cover the entire screen
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000, // Ensure it's on top of other content

                '&::before': { // Add this
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    filter: 'blur(4px)',
                    // backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: Dark overlay for better text contrast
                }
            }}
        >
            <WelcomeText variant="h1" sx={{ position: 'relative' }}>
                Welcome
            </WelcomeText>
            <AppNameText variant="h2" sx={{ position: 'relative' }}>
                Beni-Aliyah
            </AppNameText>

            <AuthForm />

            <GuestButton variant="contained" onClick={handleGuestButtonClick}>
                Enter as Guest
            </GuestButton>

        </Box>
    );
};

export default WelcomeScreen;
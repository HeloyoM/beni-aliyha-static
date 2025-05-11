import { useState } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import bgVideoUp from '../assets/2.mp4';
import { motion } from 'framer-motion';

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

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(1.5, 4),
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const WelcomeScreen = () => {
    const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
    const navigate = useNavigate();

    const handleGuestClick = () => navigate('/guest');
    const handleLoginClick = () => setAuthMode('login');
    const handleRegisterClick = () => setAuthMode('register');
    const closeForm = () => setAuthMode(null);

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
                position: authMode === 'register' ? 'inherit' : 'fixed',
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


            <video
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
            />

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

            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <WelcomeText variant="h1">Welcome</WelcomeText>

                <AppNameText variant="h2">Beni-Aliyah</AppNameText>


                {!authMode && (
                    <Box>
                        <StyledButton onClick={handleLoginClick}>Login</StyledButton>
                        <StyledButton onClick={handleRegisterClick}>Register</StyledButton>
                        <StyledButton onClick={handleGuestClick}>Enter as Guest</StyledButton>
                    </Box>
                )}



                {authMode && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AuthForm mode={authMode} onClose={closeForm} />
                    </motion.div>
                )}

            </Box>




            {/* <WelcomeText variant="h1" sx={{ position: 'relative' }}>
                Welcome
            </WelcomeText>
            <AppNameText variant="h2" sx={{ position: 'relative' }}>
                Beni-Aliyah
            </AppNameText>

            <AuthForm />

            {shouldShowWrapper && <GuestButton variant="contained" onClick={handleGuestButtonClick}>
                Enter as Guest
            </GuestButton>} */}

        </Box>
    );
};

export default WelcomeScreen;
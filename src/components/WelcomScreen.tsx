import { useState } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
// import bgVideoUp from '../assets/videos/2.mp4';
import { motion } from 'framer-motion';

// Styled component for the welcome text
const WelcomeText = styled(Typography)(({ theme }) => ({
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#fff',
    position: 'relative',
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '0%',
        height: 4,
        background: '#FFCA28',
        borderRadius: 10,
        transition: 'width 0.5s ease-in-out',
    },
    '&:hover::after': {
        width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '2.5rem',
    },
}));

// Styled component for the application name
const AppNameText = styled(Typography)(({ theme }) => ({
    fontSize: '2.25rem',
    fontWeight: 600,
    color: '#FFD54F',
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    textShadow: '1px 1px 6px rgba(0, 0, 0, 0.5)',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(1.2, 4),
    fontWeight: 'bold',
    borderRadius: '25px',
    color: '#fff',
    background: 'linear-gradient(135deg, #2196f3, #00bcd4)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        background: 'linear-gradient(135deg, #1565c0, #0097a7)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
    },
}));


const Sparkles = styled('div')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 1,
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '200%',
        height: '200%',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        animation: 'floatSparkles 60s linear infinite',
        top: '-50%',
        left: '-50%',
    },
    '@keyframes floatSparkles': {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(-100%)' },
    },
});

const WelcomeScreen = () => {
    const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
    const navigate = useNavigate();

    const handleGuestClick = () => navigate('/guest');
    const handleLoginClick = () => setAuthMode('login');
    // const handleRegisterClick = () => setAuthMode('register');
    const closeForm = () => setAuthMode(null);


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
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.7))',
                    zIndex: -1,
                }}
            />

            <Sparkles />

            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>

                <motion.div
                    style={{
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        zIndex: 2,
                    }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <WelcomeText variant="h1">Welcome</WelcomeText>

                    <AppNameText variant="h2">Bnei-Aliyah</AppNameText>


                    {!authMode && (
                        <Box>
                            <StyledButton onClick={handleLoginClick}>Login</StyledButton>
                            {/* <StyledButton onClick={handleRegisterClick}>Register</StyledButton> */}
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
                </motion.div>
            </Box>

        </Box>
    );
};

export default WelcomeScreen;
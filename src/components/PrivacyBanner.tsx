
import { useEffect, useState } from 'react';
import { Typography, Button, Slide, Paper } from '@mui/material';
import Footer from './Footer';
import Paths from '../enum/Paths.enum';

const PrivacyBanner = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('privacyAccepted');

        if (!accepted) setShow(true);
    }, []);

    const handleAccept = () => {
        localStorage.setItem('privacyAccepted', 'true');
        setShow(false);
    };

    const openTab = () => {
        window.open(Paths.PRIVACY, '_blank');
    };

    if (!show) {
        return <Footer />
    }
    return (
        <Slide direction="up" in={show} mountOnEnter unmountOnExit>
            <Paper
                elevation={8}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                    bgcolor: 'background.paper',
                    px: 2,
                    py: 2,
                    zIndex: 1500,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="body2" sx={{ mr: 2 }}>
                    We use cookies and collect usage data to improve your experience. Read our{' '}
                    <a style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} onClick={() => openTab()} target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                    </a>.
                </Typography>
                <Button variant="contained" color="primary" size="small" onClick={handleAccept} sx={{ marginRight: '4%' }}>
                    Got it
                </Button>
            </Paper>
        </Slide>
    );
};

export default PrivacyBanner;


import React, { useEffect } from 'react';
import '../../App.css';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
// import bgVideoDown from '../assets/videos/3.mp4';
import { FinalCTASection } from './FinalCTASection';
import LocationMap from '../LocationMap';
import { useTranslation } from 'react-i18next';
import GuestContactUs from './ContactUs';
import { Community, Content, FAQ, Families, Images, Videos, TestimonialsCarousel } from './index'

const GuestSection = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Align items to the center horizontally
    scrollSnapAlign: 'start',
    padding: theme.spacing(2),
    overflow: 'hidden', // To contain full-width children
}));

const GuestPage: React.FC = () => {
    const { t } = useTranslation();

    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#contact-us') {
            const section = document.getElementById('contact-us');

            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

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
                    <Images />
                </GuestSection>







                <GuestSection id="videos" sx={{ justifyContent: 'flex-start', paddingTop: 4 }}>
                    <Videos />
                </GuestSection>












                <GuestSection id="text-content" >
                    <Content />
                </GuestSection>












                <GuestSection id="faq">
                    <FAQ />
                </GuestSection>











                <GuestSection id="people">
                    <Families />
                </GuestSection>











                <GuestSection id="testi">
                    <TestimonialsCarousel />
                </GuestSection>











                <GuestSection id="community" style={{ position: 'relative', overflow: 'hidden' }}>

                    <Community />
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









            </Box>
        </>
    );
};

export default GuestPage;




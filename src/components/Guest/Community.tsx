import { Box, Button, Container, Grid, Typography, useMediaQuery } from '@mui/material'
import { motion } from 'framer-motion'
import React from 'react'
import { useTranslation } from 'react-i18next'
// import bgVideoUp from '../assets/videos/2.mp4';


const Community = () => {
    const { t } = useTranslation();

    const isMobile = useMediaQuery('(max-width:600px)');

    const cards = [
        { icon: '🌱', title: t('guest.community.family_oriented_title'), text: t('guest.community.family_oriented_text') },
        { icon: '🤝', title: t('guest.community.supportive_network_title'), text: t('guest.community.supportive_network_text') },
    ]

    if (!isMobile) {
        cards.push({ icon: '📚', title: t('guest.community.community_great_education_title'), text: t('guest.community.community_great_education_text') })
    }

    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default Community
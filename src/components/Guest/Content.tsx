import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles';

const ContentBox = styled(Box)(({ theme }) => ({
    maxWidth: '80%',
    margin: '0 auto',
    textAlign: 'center',
}));

const Content = () => {
    const { t } = useTranslation();

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
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
    )
}

export default Content
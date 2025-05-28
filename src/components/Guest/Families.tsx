import { Box, Card, CardContent, Grid, Typography, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Families = () => {
    const { t } = useTranslation();

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{ py: 6, px: 2 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                {t('guest.testimonials.what_families_are_saying')}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                <Grid >
                    <Card sx={{ p: 2 }}>
                        <CardContent>
                            <Typography variant="body1" fontStyle="italic">
                                {t('guest.testimonials.testimonial1')}
                            </Typography>
                            <Typography variant="subtitle2" mt={2} textAlign="right">
                                {t('guest.testimonials.testimonial_1_author')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid>
                    <Card sx={{ p: 2 }}>
                        <CardContent>
                            <Typography variant="body1" fontStyle="italic">
                                {t('guest.testimonials.testimonial2')}
                            </Typography>
                            <Typography variant="subtitle2" mt={2} textAlign="right">
                                {t('guest.testimonials.testimonial_2_author')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {!isMobile && <Grid>
                    <Card sx={{ p: 2 }}>
                        <CardContent>
                            <Typography variant="body1" fontStyle="italic">
                                {t('guest.testimonials.testimonial3')}
                            </Typography>
                            <Typography variant="subtitle2" mt={2} textAlign="right">
                                {t('guest.testimonials.testimonial_3_author')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>}
            </Grid>
        </Box>
    )
}

export default Families
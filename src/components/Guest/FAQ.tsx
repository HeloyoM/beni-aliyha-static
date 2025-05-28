import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { Expand } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const FAQ = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ py: 6, px: 2, maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                {t('guest.faq.faq_title')}
            </Typography>

            <Accordion>
                <AccordionSummary expandIcon={<Expand />}>
                    <Typography>{t('guest.faq.faq_1_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {t('guest.faq.faq_1_answer')}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<Expand />}>
                    <Typography>{t('guest.faq.faq_2_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {t('guest.faq.faq_2_answer')}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<Expand />}>
                    <Typography>{t('guest.faq.faq_3_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {t('guest.faq.faq_3_answer')}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<Expand />}>
                    <Typography>{t('guest.faq.faq_4_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {t('guest.faq.faq_4_answer')}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<Expand />}>
                    <Typography>{t('guest.faq.faq_5_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {t('guest.faq.faq_5_answer')}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default FAQ

import { Box, Button, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const FinalCTASection = () => {
    const { t } = useTranslation();

    return (
        <Box
            component={motion.section}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            sx={{
                py: 10,
                px: 2,
                textAlign: "center",
                background: "linear-gradient(to right, #e0f7fa, #80deea)",
                color: "#004d40",
            }}
        >
            <Box maxWidth="md" mx="auto">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {t('guest.cta.title')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    {t('guest.cta.sub_title')}
                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="center"
                    spacing={2}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        href="#contact"
                    >
                        {t('guest.cta.actions.contact')}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        disabled
                        href="/path-to-pdf"
                    >
                        {t('guest.cta.actions.download_pdf')}
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
};

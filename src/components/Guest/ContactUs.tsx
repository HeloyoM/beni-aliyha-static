import React, { useState } from "react";
import { Box, Button, Fade, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { postGuestMessage } from "../../api/message";
import { Send } from "lucide-react";

const GuestContactUs = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { t } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name, e.target.value)
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await postGuestMessage({ description: form.message, email: form.email, name: form.name })

            const data = response.data as any;

            if (response.status < 200) {
                throw new Error(`Failed to send message: ${data.message}`);
            }

            setSuccess(true);

            setOpen(true);
            setForm({ name: "", email: "", message: "" });
        } catch (err: any) {
            setError(err.message || 'An error occurred while sending the message.');
        }
    };


    return (
        <React.Fragment>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, color: 'white' }}>
                {t('guest.contact_us.title')}
            </Typography>

            <Fade in timeout={1000}>


                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    id="contact"
                    sx={{ py: 8, px: 2, backgroundColor: "#f9f9f9" }}
                >
                    <Box maxWidth="sm" mx="auto" component={Paper} elevation={6} p={4} borderRadius={4}>
                        <Typography variant="h4" gutterBottom textAlign="center">
                            {t('guest.contact_us.title')}
                        </Typography>
                        <Typography variant="body1" textAlign="center" mb={3}>
                            {t('guest.contact_us.subtitle')}
                        </Typography>
                        <Box component="form" onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label={t('guest.contact_us.name_label')}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label={t('guest.contact_us.email_label')}
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label={t('guest.contact_us.message_label')}
                                name="message"
                                multiline
                                rows={4}
                                value={form.message}
                                onChange={handleChange}
                                required
                            />
                            <Box textAlign="center" mt={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    endIcon={<Send />}
                                    component={motion.button}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('guest.contact_us.send_message_button')}
                                </Button>
                            </Box>

                        </Box>
                    </Box>

                    <Snackbar
                        open={open}
                        autoHideDuration={4000}
                        onClose={() => setOpen(false)}
                        message="Message sent! We'll get back to you soon."
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    />
                </Box>
            </Fade>
        </React.Fragment>
    )
}

export default GuestContactUs;

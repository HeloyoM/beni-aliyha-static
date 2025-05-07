import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const testimonials = [
    {
        quote: "We thought moving to Israel would be hard. But this community made it feel like we were coming home. Our kids are thriving.",
        name: "Sarah R., NJ to Israel",
    },
    {
        quote: "I never imagined we’d feel so supported. From day one, we had friends, mentors, and a place at every Shabbat table.",
        name: "Daniel T., NY to Israel",
    },
    {
        quote: "It’s not just a community. It’s a family. Moving here changed our lives — and our children’s future.",
        name: "Leah M., Chicago to Israel",
    },
];

export default function TestimonialsCarousel() {
    return (
        <Box sx={{ py: 8, px: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
            >
                <Typography variant="h4" gutterBottom>
                    What Families Are Saying
                </Typography>
                <Typography variant="subtitle1" mb={4}>
                    Real stories from people who made the move
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
            >
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    pagination={{ enabled: true }}
                    modules={[Pagination]}
                    style={{ maxWidth: 600, margin: 'auto' }}
                >
                    {testimonials.map((t, idx) => (
                        <SwiperSlide key={idx}>
                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: 'white',
                                        borderRadius: 3,
                                        boxShadow: 4,
                                        px: 4,
                                        py: 5,
                                        minHeight: 200,
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                        },
                                    }}
                                >
                                    <Typography variant="body1" fontStyle="italic">
                                        “{t.quote}”
                                    </Typography>
                                    <Typography variant="subtitle2" mt={3} textAlign="right">
                                        — {t.name}
                                    </Typography>
                                </Box>
                            </motion.div>
                        </SwiperSlide>
                    ))}

                </Swiper>
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                viewport={{ once: true }}
            >
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 4 }}
                    href="/downloads/testimonials.pdf"
                    target="_blank"
                >
                    Download Stories as PDF
                </Button>
            </motion.div>
        </Box>
    );
}

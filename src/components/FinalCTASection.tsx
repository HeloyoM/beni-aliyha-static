// FinalCTASection.tsx
import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";

export const FinalCTASection = () => {
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
                    Ready to Make a Life-Changing Move?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Whether you're just curious or already packing your bags, we're here to welcome you.
                    Discover a life of purpose, community, and belonging in Israel.
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
                        Contact Us Today
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        disabled
                        href="/path-to-pdf"
                    >
                        Download Info PDF
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useTranslation } from 'react-i18next';

const DonationCard: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        px: isMobile ? 2 : 4,
        py: 6,
        background: 'linear-gradient(to right, #ffe0e3, #fff6f0)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          borderRadius: 6,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          p: isMobile ? 3 : 5,
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <FavoriteIcon color="error" sx={{ fontSize: 50 }} />

            <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight={700}>
              Make a Difference Today
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450 }}>
              Your support empowers us to grow our impact, help more families,
              and strengthen our community. Every contribution matters.
            </Typography>

            <Button
              variant="contained"
              size="large"
              href="https://www.matara.pro/nedarimplus/online/?mosad=7009971"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mt: 2,
                px: 5,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 3,
                background: 'linear-gradient(to right, #ff4081, #f50057)',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  background: 'linear-gradient(to right, #f50057, #d500f9)',
                },
              }}
            >
              Donate Now
            </Button>

            <Typography variant="caption" color="text.secondary" mt={2}>
              Secure donation powered by Matara
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DonationCard;

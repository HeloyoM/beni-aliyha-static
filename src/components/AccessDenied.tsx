import { Box, Typography, Button, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            bgcolor="#f9f9f9"
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    maxWidth: 400,
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: 'white',
                }}
            >
                <LockIcon color="error" sx={{ fontSize: 50, mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                    Your account is not active yet.
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Please contact an administrator or support if you believe this is a mistake.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{ mt: 1 }}
                >
                    Back to Home
                </Button>
            </Paper>
        </Box>
    );
};

export default AccessDenied;

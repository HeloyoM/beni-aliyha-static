import { Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import '../App.css';

const MainContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4), // Default padding
    maxWidth: '1200px',        // Maximum width for the content
    margin: '0 auto',           // Center the content horizontally
    [theme.breakpoints.down('md')]: { // Smaller padding on mobile
        padding: theme.spacing(2),
    },
}));

interface ScreenWrapperProps {
    children: React.ReactNode;
    maxWidth?: string; // Allow overriding max-width
    padding?: number; // Allow overriding padding
}

const ScreenWrapper = ({ children, maxWidth, padding }: ScreenWrapperProps) => {
    return (
        <Box
            sx={{
                minHeight: '7vh', // Ensure full viewport height
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Centers the MainContent
            }}
        >
            <MainContent>
                {children}
            </MainContent>
        </Box>
    )
}

export default ScreenWrapper;
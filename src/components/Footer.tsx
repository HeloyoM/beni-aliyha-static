import { Box, Typography } from "@mui/material";
import Grid2 from '@mui/material/Grid';
import { MOBILE_WIDTH, useWindowWidth as useMobile } from "../utils/useMobile";
import Paths from "../enum/Paths.enum";

const Footer = () => {
    const windowWidth = useMobile();

    const isMobile = MOBILE_WIDTH >= windowWidth;

    const link = '../documents/privacy.pdf';

    const openTab = () => {
        window.open(Paths.PRIVACY, '_blank');
    };

    return (
        <Box
            component="footer"
            sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                bgcolor: 'background.paper',
                px: 2,
                py: 2,
                zIndex: 1500,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Grid2 container spacing={2}>
                <Typography variant="body2" sx={{ position: 'absolute', bottom: 0, alignItems: 'center', display: 'flex' }}>
                    © {new Date().getFullYear()} 0587769313 | All Rights Reserved Meir Juli
                    <a style={{ textDecoration: 'underline', color:'blue', cursor: 'pointer', marginLeft: 6 }} onClick={() => openTab()}>Privacy Policy</a>
                </Typography>
            </Grid2>
        </Box>
    )
}

export default Footer;
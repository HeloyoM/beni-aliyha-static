import { Box, Button, Typography } from "@mui/material";
import Grid2 from '@mui/material/Grid';
import Paths from "../enum/Paths.enum";
import { useMediaQuery } from '@mui/material';

const Footer = () => {
    const isMobile = useMediaQuery('(max-width:600px)');

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
                flexDirection: { xs: 'row', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Grid2 container spacing={2}>
                <Typography variant="body2" sx={{ position: 'absolute', bottom: 0, alignItems: 'center', display: 'flex' }}>
                    © {new Date().getFullYear()} All Rights Reserved {!isMobile && <main> Meir Juli | 0587769313 | mybs2323@gmail.com </main>}
                    <a style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer', marginLeft: 6 }} onClick={() => openTab()}>Privacy Policy</a>
                </Typography>

                {!isMobile && <Button variant="outlined" sx={{ width: 22, height: 22, position: 'absolute', bottom: 2, right: 40, alignItems: 'center', display: 'flex' }}>
                    Report
                </Button>}
            </Grid2>
        </Box>
    )
}

export default Footer;
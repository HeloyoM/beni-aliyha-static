import { Alert, Box, Button, Snackbar, styled, Typography } from "@mui/material";
import Grid2 from '@mui/material/Grid';
import Paths from "../enum/Paths.enum";
import { useMediaQuery } from '@mui/material';
import ReportDialog from "./ReportDialog";
import { useState } from "react";

const ReportButton = styled(Button)(({ theme }) => ({
    width: 22,
    height: 22,
    position: 'absolute',
    bottom: 2,
    right: 40,
    alignItems: 'center',
    display: 'flex',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
        backgroundColor: '#e3f2fd'
    },
}))

const Footer = () => {
    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const isMobile = useMediaQuery('(max-width:600px)');

    const openTab = () => {
        window.open(Paths.PRIVACY, '_blank');
    };

    const closeDialog = () => setOpen(false)

    const handleReportSubmit = (data: any) => {
        // send to backend (replace this with API call)
        console.log('Report submitted:', data);

        const msg =
            data.type === 'bug'
                ? "Thank you for reporting the bug! We'll take a look 🛠️"
                : "Thanks for your idea! We love hearing from you ✨";

        setSnackbarMessage(msg);
        setOpenSnackbar(true);
    };

    return (
        <>
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

                    {!isMobile && <ReportButton variant="outlined" onClick={() => setOpen(true)}>
                        Report
                    </ReportButton>}

                </Grid2>
            </Box>

            <ReportDialog
                open={open}
                onClose={closeDialog}
                onSubmit={handleReportSubmit}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Footer;
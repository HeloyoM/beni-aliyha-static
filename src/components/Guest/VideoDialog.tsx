import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { XCircle } from "lucide-react"

type Props = {
    openDialog: { open: boolean; src: string }
    handleCloseDialog: () => void
}
const VideoDialog = ({ openDialog, handleCloseDialog }: Props) => {

    return (
        <Dialog open={openDialog.open} onClose={handleCloseDialog} fullWidth maxWidth="lg">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    Video
                    <IconButton onClick={handleCloseDialog} size="large">
                        <XCircle style={{ fontSize: 'inherit' }} />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {openDialog.open && ( // Conditionally render the iframe
                    <iframe
                        width="100%"
                        height="500px" // Adjust as needed
                        src={openDialog.src}
                        title="Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ border: 'none' }}
                    />
                )}
            </DialogContent>

        </Dialog>
    )
}

export default VideoDialog;
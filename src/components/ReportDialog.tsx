import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormGroup, FormControlLabel, Checkbox,
    TextField, Button, ToggleButton, ToggleButtonGroup,
    Typography, Box
} from '@mui/material';

const availableRoutes = [
    '/', '/guest', '/home', '/profile', '/messages',
    '/campaings', '/access-denied'
];

type Props = {
    open: boolean
    onSubmit: (data: any) => void
    onClose: () => void
}
export default function ReportDialog({ open, onClose, onSubmit }: Props) {
    const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
    const [reportType, setReportType] = useState<string>('bug'); // 'bug' or 'feature'
    const [description, setDescription] = useState<string>('');

    const handleToggleRoute = (route: string) => {
        setSelectedRoutes((prev) =>
            prev.includes(route)
                ? prev.filter((r) => r !== route)
                : [...prev, route]
        );
    };

    const handleSubmit = () => {
        const reportData = {
            type: reportType,
            routes: selectedRoutes,
            description
        };

        onSubmit(reportData);
        onClose();
        // Reset
        setSelectedRoutes([]);
        setDescription('');
        setReportType('bug');
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Report a Bug or Suggest a Feature</DialogTitle>

            <DialogContent>
                <Box mb={2}>
                    <Typography variant="subtitle1">What kind of report is this?</Typography>
                    <ToggleButtonGroup
                        value={reportType}
                        exclusive
                        onChange={(e, newType) => setReportType(newType || reportType)}
                        size="small"
                        sx={{ mt: 1 }}
                    >
                        <ToggleButton value="bug">🐞 Bug</ToggleButton>
                        <ToggleButton value="feature">✨ Feature Request</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box mb={2}>
                    <Typography variant="subtitle1">Select relevant pages (optional)</Typography>
                    <FormGroup row>
                        {availableRoutes.map((route) => (
                            <FormControlLabel
                                key={route}
                                control={
                                    <Checkbox
                                        checked={selectedRoutes.includes(route)}
                                        onChange={() => handleToggleRoute(route)}
                                    />
                                }
                                label={route}
                            />
                        ))}
                    </FormGroup>
                </Box>

                <TextField
                    label={reportType === 'bug' ? "Describe the bug" : "Describe your idea"}
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!description.trim()}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

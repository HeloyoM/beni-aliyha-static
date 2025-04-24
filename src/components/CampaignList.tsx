import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getCampaigns } from '../api/campaign';

// Styled components for enhanced UI
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: theme.shadows[3],
    marginTop: theme.spacing(4),
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[5],
    },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

const CampaignList = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Get token from localStorage

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                if (!token) {
                    navigate('/'); // Redirect to login if no token
                    return;
                }
                const response = await getCampaigns()

                const data = response.data as any
                if (response.status < 200) {
                    throw new Error(`Failed to fetch campaigns: ${response.status}`);
                }

                setCampaigns(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching campaigns.');
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [navigate]);

    const handleSelectCmapaign = (id: string) => {
        const campaign = campaigns.find(c => c.id == id)

        if (campaign) {
            setSelectedCampaign(campaign)
        }
    }
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress size={60} />
            </div>
        );
    }

    if (error) {
        return (
            <Alert severity="error" variant="outlined" style={{ marginTop: '20px' }}>
                {error}
            </Alert>
        );
    }

    if (campaigns.length === 0) {
        return (
            <StyledPaper>
                <Typography variant="body1" color="text.secondary" align="center">
                    No campaigns found.
                </Typography>
            </StyledPaper>
        );
    }

    return (
        <StyledPaper sx={{ marginTop: '4%' }}>
            <Typography variant="h4" component="h2" gutterBottom style={{ color: '#1a5235' }}>
                Campaigns
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableHeadCell>Name</StyledTableHeadCell>
                        <StyledTableHeadCell>Type</StyledTableHeadCell>
                        <StyledTableHeadCell>Due Date</StyledTableHeadCell>
                        <StyledTableHeadCell>Description</StyledTableHeadCell>
                        <StyledTableHeadCell>Active</StyledTableHeadCell>
                        <StyledTableHeadCell>Created At</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow
                            onClick={() => handleSelectCmapaign(campaign.id)}
                            key={campaign.id}
                            sx={{ "&:hover": { backgroundColor: 'lightgrey', cursor: 'pointer' } }}>
                            <StyledTableCell>{campaign.name}</StyledTableCell>
                            <StyledTableCell>{campaign.type}</StyledTableCell>
                            <StyledTableCell>{format(new Date(campaign.dueDate), 'PPP')}</StyledTableCell>
                            <StyledTableCell>{campaign.description}</StyledTableCell>
                            <StyledTableCell>{campaign.active === 1 ? 'yes' : 'no'}</StyledTableCell>
                            <StyledTableCell>{campaign.created_at}</StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </StyledPaper>
    );
};

export default CampaignList;
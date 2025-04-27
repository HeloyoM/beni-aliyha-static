import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, Typography, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getCampaignMembers, getCampaigns, joinCampaign } from '../api/campaign';
import AppUserContext from '../context/AppUserContext';

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
    const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<any[]>([]); // State to store members
    const [joinCampaignLoading, setJoinCampaignLoading] = useState(false); // Track join campaign loading
    const [joinCampaignSuccess, setJoinCampaignSuccess] = useState(false); // Track join campaign success
    const [participationType, setParticipationType] = useState('');  // State for participation type
    const [openJoinDialog, setOpenJoinDialog] = useState(false); // State to open Join Campaign Dialog.

    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Get token from localStorage

    const { user } = useContext(AppUserContext);

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

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCampaign(null); // Reset selected campaign
        setMembers([]); // Clear members
        document.title = "Campaigns"
    };

    const handleSelectCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
            setSelectedCampaign(campaign);
            setOpenModal(true); // Open the dialog
            setLoading(true); //start loading
            try {
                const response = await getCampaignMembers(campaignId);
                const membersData = response.data as any;
                setMembers(membersData);
                setLoading(false);
            } catch (error) {
                setError("Failed to load members")
                setLoading(false)
            }

        }
    };

    useEffect(() => {
        if (openModal && selectedCampaign) {
            document.title = `Members of ${selectedCampaign.campaign_name}`;
        }

        return () => {
            document.title = ''
        }
    }, [openModal, selectedCampaign]);


    const handleJoinCampaign = async () => {
        if (!participationType) {
            setError('Please select a participation type.');
            return;
        }

        setJoinCampaignLoading(true);
        setError(null);
        try {
            // Replace 'someCampaignId' with the actual campaign ID.  In a real app,
            // you'd get this from the route, a selected campaign, or wherever
            // the user is indicating which campaign they want to join.
            const response = await joinCampaign(selectedCampaign.id);

            const data = response.data as any;

            if (response.status < 200 || response.status >= 300) {
                throw new Error(data?.message || 'Failed to join campaign');
            }
            setJoinCampaignSuccess(true);
            setOpenJoinDialog(false); // Close dialog on success
        } catch (err: any) {
            setError(err.message || 'An error occurred while joining the campaign.');
        } finally {
            setJoinCampaignLoading(false);
        }
    };
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
        <>
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
                                onClick={() => handleSelectCampaign(campaign.id)}
                                key={campaign.id}
                                sx={{ "&:hover": { backgroundColor: 'lightgrey', cursor: 'pointer' } }}>
                                <StyledTableCell>{campaign.campaign_name}</StyledTableCell>
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
            {/* Dialog for displaying members */}
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>Members of {selectedCampaign?.campaign_name}</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                            <CircularProgress size={40} />
                        </div>
                    ) : members.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableHeadCell>Joined At</StyledTableHeadCell>
                                    <StyledTableHeadCell>Status</StyledTableHeadCell>
                                    <StyledTableHeadCell>name</StyledTableHeadCell>
                                    <StyledTableHeadCell>phone number</StyledTableHeadCell>
                                    <StyledTableHeadCell>email</StyledTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {members.map((member: any) => (
                                    <TableRow key={member.member_id}>
                                        <StyledTableCell>{format(new Date(member.joined_date), 'PPPpp')}</StyledTableCell>
                                        <StyledTableCell>{member.status}</StyledTableCell>
                                        <StyledTableCell>{`${member.first_name + ' ' + member.last_name}`}</StyledTableCell>
                                        <StyledTableCell>{member.phone}</StyledTableCell>
                                        <StyledTableCell>{member.email}</StyledTableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                            {members.find(m => m.member_id === user.id) ? null : <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenJoinDialog(true)} // Open Join Campaign Dialog
                                style={{ marginTop: 20, backgroundColor: '#4caf50', color: '#fff', borderRadius: 8 }}
                            >
                                Join a Campaign
                            </Button>}
                        </Table>
                    ) : (
                        <Typography variant="body1" color="text.secondary" align="center">
                            <Typography>No members found for this campaign.</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenJoinDialog(true)} // Open Join Campaign Dialog
                                style={{ marginTop: 20, backgroundColor: '#4caf50', color: '#fff', borderRadius: 8 }}
                            >
                                Join a Campaign
                            </Button>
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* Join Campaign Dialog */}
            <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)}>
                <DialogTitle>Join a Campaign</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error">{error}</Alert>}
                    {joinCampaignSuccess && <Alert severity="success">Successfully joined the campaign!</Alert>}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="participation-type-label">Participation Type</InputLabel>
                        <Select
                            labelId="participation-type-label"
                            id="participation-type"
                            value={participationType}
                            onChange={(e) => setParticipationType(e.target.value as string)}
                            label="Participation Type"
                        >
                            <MenuItem value="participant">Participant</MenuItem>
                            <MenuItem value="volunteer">Volunteer</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenJoinDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleJoinCampaign}
                        disabled={joinCampaignLoading || !participationType}
                        variant="contained"
                        color="primary"
                    >
                        {joinCampaignLoading ? <CircularProgress size={20} /> : 'Join'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CampaignList;
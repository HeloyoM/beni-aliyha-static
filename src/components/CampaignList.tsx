import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, Typography, CircularProgress, Alert, Tooltip, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Collapse, LinearProgress } from '@mui/material';
import { TextField, Box, Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { CheckCircle, Event } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCampaignMembers, getCampaigns, joinCampaign } from '../api/campaign';
import { useAppUser } from '../context/AppUser.context';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ICampaign from '../interfaces/Cmapaign.interface';
import ICampaignMember from '../interfaces/ICampaignMember.interface';
import Paths from '../enum/Paths.enum';
import { useTranslation } from 'react-i18next';

// Styled components for enhanced UI
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2), // Reduced padding for mobile
    borderRadius: '12px',
    boxShadow: theme.shadows[3],
    marginTop: theme.spacing(2), // Reduced margin for mobile
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[5],
    },
    [theme.breakpoints.up('sm')]: {  // Apply larger padding and margin for larger screens
        padding: theme.spacing(3),
        marginTop: theme.spacing(4),
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
    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<ICampaignMember[]>([]); // State to store members
    const [joinCampaignLoading, setJoinCampaignLoading] = useState(false); // Track join campaign loading
    const [joinCampaignSuccess, setJoinCampaignSuccess] = useState(false); // Track join campaign success
    const [participationType, setParticipationType] = useState('');  // State for participation type
    const [openJoinDialog, setOpenJoinDialog] = useState(false); // State to open Join Campaign Dialog.
    const [joinComment, setJoinComment] = useState('');
    const [openCommentDialog, setOpenCommentDialog] = useState<{ open: boolean; comment: string }>({ open: false, comment: '' }); // State for comment dialog

    const { t } = useTranslation();

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const { user } = useAppUser();

    useEffect(() => {

        if (!token) {
            navigate(Paths.ON_BOARDING);
            return;
        }

        const fetchCampaigns = async () => {
            try {

                const response = await getCampaigns()

                const data = response.data as any
                if (response.status < 200) {
                    throw new Error(`Failed to fetch campaigns: ${response.status}`);
                }

                setCampaigns(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || t('campaign.campaign_list.error'));
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [navigate]);

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCampaign(null); // Reset selected campaign
        setMembers([]); // Clear members
        document.title = t('campaign.campaign_list.title')
    };

    const handleSelectCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
            setSelectedCampaign(campaign);
            setOpenModal(true);
            setLoading(true);
            try {
                const response = await getCampaignMembers(campaignId);
                const membersData = response.data as any;
                setMembers(membersData);
                setLoading(false);
            } catch (error) {
                setError(t('campaign.campaign_list.failed_load_members'))
                setLoading(false)
            }

        }
    };

    useEffect(() => {
        if (openModal && selectedCampaign) {
            document.title = t('campaign.campaign_list.title_members_of', { campaignName: selectedCampaign.campaign_name });
        }

        return () => {
            document.title = ''
        }
    }, [openModal, selectedCampaign]);


    const handleJoinCampaign = async () => {
        if (!participationType) {
            setError(t('campaign.campaign_list.joining_modal.select_participation_type'));
            return;
        }

        setJoinCampaignLoading(true);
        setError(null);
        try {
            // Replace 'someCampaignId' with the actual campaign ID.  In a real app,
            // you'd get this from the route, a selected campaign, or wherever
            // the user is indicating which campaign they want to join.
            const payload = {
                campaignId: selectedCampaign.id,
                joinComment
            }
            const response = await joinCampaign(payload);

            const data = response.data as any;

            if (response.status < 200 || response.status >= 300) {
                throw new Error(data?.message || t('campaign.campaign_list.joining_modal.failed_join'));
            }
            setJoinCampaignSuccess(true);
            setOpenJoinDialog(false); // Close dialog on success
            setJoinComment(''); // Clear the comment

            // Refresh the members list to show the updated information
            const membersResponse = await getCampaignMembers(selectedCampaign.id);
            const membersData = membersResponse.data as any;

            setMembers(membersData);
        } catch (err: any) {
            setError(err.message || t('campaign.campaign_list.joining_modal.error'));
        } finally {
            setJoinCampaignLoading(false);
        }
    };

    const getTotalDonated = (campaignId: string) => {
        // const campaignMembers = members.filter(member => member.campaign_id === campaignId);
        return members.reduce((sum, member) => sum + (member.donated_amount || 0), 0);
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
                    {t('campaign.campaign_list.no_campaigns')}
                </Typography>
            </StyledPaper>
        );
    }

    return (
        <>
            <StyledPaper sx={{ marginTop: '4%' }}>
                <Typography variant="h4" component="h2" gutterBottom style={{ color: '#1a5235' }}>
                    {t('campaign.campaign_list.title')}
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableHeadCell>{t('campaign.campaign_list.table.name')}</StyledTableHeadCell>
                            <StyledTableHeadCell>{t('campaign.campaign_list.table.type')}</StyledTableHeadCell>
                            <StyledTableHeadCell>{t('campaign.campaign_list.table.due')}</StyledTableHeadCell>
                            <StyledTableHeadCell>{t('campaign.campaign_list.table.description')}</StyledTableHeadCell>
                            <StyledTableHeadCell>{t('campaign.campaign_list.table.active')}</StyledTableHeadCell>
                            <StyledTableHeadCell>{t('campaign.campaign_list.table.created_at')}</StyledTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map((campaign) => (
                            <TableRow
                                onClick={() => handleSelectCampaign(campaign.id)}
                                key={campaign.id}
                                sx={{ "&:hover": { backgroundColor: 'lightgrey', cursor: 'pointer' } }}>
                                <StyledTableCell>{campaign.name}</StyledTableCell>
                                <StyledTableCell>{campaign.type}</StyledTableCell>
                                <StyledTableCell>{format(new Date(campaign.dueDate), 'PPP')}</StyledTableCell>
                                <StyledTableCell>{campaign.description}</StyledTableCell>
                                <StyledTableCell sx={{
                                    backgroundColor: campaign.active ? '#e8f5e9' : 'inherit',
                                    '&:hover': { backgroundColor: '#f1f1f1' }
                                }}>{campaign.active ? 'yes' : 'no'}</StyledTableCell>
                                <StyledTableCell sx={{ width: 'fit-content' }}>{campaign.created_at}</StyledTableCell>
                                {campaign.type.toLowerCase() === 'donate' && <StyledTableCell>
                                    <LinearProgress
                                        variant="determinate"
                                        value={
                                            Math.min(
                                                100,
                                                (getTotalDonated(campaign.id) / campaign.goal_amount) * 100
                                            )
                                        }
                                        sx={{ height: 10, borderRadius: 5 }}
                                    />
                                    {/* <Typography variant="caption" display="block" textAlign="right" mt={1}>
                                        {`$${getTotalDonated(campaign.id)} of $${campaign.goal_amount}`}
                                    </Typography> */}
                                </StyledTableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledPaper>


            {/* Dialog for displaying members */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                    <DialogContent dividers sx={{ px: 3, py: 2, maxHeight: '70vh', overflowY: 'auto' }}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                                <CircularProgress size={40} />
                            </Box>
                        ) : members.length > 0 ? (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    {t('campaign.campaign_list.members_modal')}
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ overflowX: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableHeadCell>{t('campaign.campaign_list.table.joined_at')}</StyledTableHeadCell>
                                                <StyledTableHeadCell>{t('campaign.campaign_list.table.status')}</StyledTableHeadCell>
                                                <StyledTableHeadCell>{t('campaign.campaign_list.table.name')}</StyledTableHeadCell>
                                                <StyledTableHeadCell>{t('campaign.campaign_list.table.phone_number')}</StyledTableHeadCell>
                                                <StyledTableHeadCell>{t('campaign.campaign_list.table.email')}</StyledTableHeadCell>
                                                <StyledTableHeadCell>{t('campaign.campaign_list.table.comment')}</StyledTableHeadCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {members.map((member: any) => {
                                                const hasComment = member.comment && member.comment.length > 0;
                                                return (

                                                    <TableRow key={member.member_id} >
                                                        <StyledTableCell>{format(new Date(member.joined_date), 'PPPpp')}</StyledTableCell>
                                                        <StyledTableCell>{member.status}</StyledTableCell>
                                                        <StyledTableCell>{`${member.first_name + ' ' + member.last_name}`}</StyledTableCell>
                                                        <StyledTableCell>{member.phone}</StyledTableCell>
                                                        <StyledTableCell>{member.email}</StyledTableCell>
                                                        <StyledTableCell>
                                                            {hasComment ? (
                                                                <Tooltip title={member.comment} arrow>
                                                                    <IconButton size="small" onClick={() => setOpenCommentDialog({ open: true, comment: member.comment })}>
                                                                        <MessageCircle size={16} color="#4caf50" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            ) : (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {t('campaign.campaign_list.members_modal.no_comments')}
                                                                </Typography>
                                                            )}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                )
                                            })}

                                        </TableBody>
                                        {members.find(m => m.member_id === user.id) ? null : <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setOpenJoinDialog(true)} // Open Join Campaign Dialog
                                            style={{ marginTop: 20, backgroundColor: '#4caf50', color: '#fff', borderRadius: 8 }}
                                        >
                                            {t('campaign.campaign_list.members_modal.button.join_campaign')}
                                        </Button>}
                                    </Table>

                                </Box>
                            </>
                        ) : (
                            <Box textAlign="center" mt={2}>
                                <Typography variant="body1" color="text.secondary">
                                    {t('campaign.campaign_list.members_modal.no_members')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => setOpenJoinDialog(true)}
                                    sx={{ mt: 2, borderRadius: 2 }}
                                >
                                    {t('campaign.campaign_list.members_modal.button.join_campaign')}
                                </Button>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>{t('campaign.campaign_list.members_modal.button.close')}</Button>
                    </DialogActions>
                </Dialog>
            </motion.div>

            <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)}>
                <DialogTitle>{t('campaign.campaign_list.members_modal.button.join_campaign')}</DialogTitle>
                <DialogContent>
                    {error && <Collapse in={!!error}><Alert severity="error">{error}</Alert></Collapse>}
                    {joinCampaignSuccess && <Alert severity="success">{t('campaign.campaign_list.joining_modal.success')}</Alert>}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="participation-type-label">{t('campaign.campaign_list.joining_modal.participation_type_label')}</InputLabel>
                        <Select
                            labelId="participation-type-label"
                            id="participation-type"
                            value={participationType}
                            onChange={(e) => setParticipationType(e.target.value as string)}
                            label="Participation Type"
                        >
                            <MenuItem value="participant">{t('campaign.campaign_list.joining_modal.participation_types.participant')}</MenuItem>
                            <MenuItem value="volunteer">{t('campaign.campaign_list.joining_modal.participation_types.volunteer')}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        id="join-comment"
                        label={t('campaign.campaign_list.joining_modal.additional_info')}
                        multiline
                        rows={3}
                        value={joinComment}
                        onChange={(e) => setJoinComment(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenJoinDialog(false)}>{t('campaign.campaign_list.joining_modal.button.cancel')}</Button>
                    <Button
                        onClick={handleJoinCampaign}
                        disabled={joinCampaignLoading || !participationType}
                        variant="contained"
                        color="primary"
                    >
                        {joinCampaignLoading ? <CircularProgress size={20} /> : t('campaign.campaign_list.joining_modal.button.join')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CampaignList;
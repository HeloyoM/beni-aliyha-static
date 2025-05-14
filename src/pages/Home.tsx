import React, { useEffect, useState } from 'react';
import '../App.css';
import { Button, CardContent, Typography, Grid, Paper, styled, Box, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery } from '@mui/material';
import Campaign from '../components/Campaign';
import { Clock, Award, PlusCircle, List, Expand } from 'lucide-react';
import { DayPicker } from "react-day-picker";
import Lesson from '../components/Lessons/Lesson';
import Scheduler from '../components/Scheduler';
import CandlelightingTimes from '../components/CandleLightingTimes';
import LessonsList from '../components/Lessons/LessonsList';
import useLessons from '../components/Lessons/useLessons';
import Birthdays from '../components/Birthdays';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';
import GuestMessages from '../components/GuestsMessages';
import PaymentsTable from '../components/PaymentsTable';
import { useAppUser } from '../context/AppUser.context';
import { getAllPayments, getPayments } from '../api/payments';
import QuickAddPayment from '../components/QuickAddPayment';
import Events from '../components/Events/Events';
import PublicMessages from '../components/PublicMessages';
import EventForm from '../components/Events/EventForm';
import { Masonry } from '@mui/lab';
import IPayment from '../interfaces/IPayment.interface';
import DonationCard from '../components/DonationCard';

// Styled components for consistent styling
const DashboardSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    backgroundColor: '#e3f2fd'
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const SectionTitleWithIcon = styled(SectionTitle)(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.dark,
}));



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: (theme.vars || theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const Home: React.FC = () => {
  const [isInsertingCampaign, setIsInsertingCampaign] = useState(false);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const { lessons, setLessons } = useLessons();

  const { canEditPayments, user } = useAppUser();

  const fetchPayments = async () => {
    try {

      console.log({ canEditPayments })
      const response = canEditPayments ? await getAllPayments() : await getPayments();

      const data = response.data as any;

      if (response.status !== 200) {
        throw new Error(data.message || 'Failed to fetch payments');
      }

      setPayments(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canEditPayments) {
      fetchPayments();
    }
  }, [canEditPayments])


  return (


    <Box sx={{ padding: '20px' }}>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(../assets/12.jpg)',
          zIndex: -1,
        }}
      />


      <Grid size={{ xs: 6, sm: 6, md: 4, xl: 6, lg: 10 }}>
        <DashboardSection style={{ backgroundColor: '#e0f7fa', maxWidth: '450px', margin: 'auto auto' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            <CandlelightingTimes />

            <Scheduler />

          </CardContent>
        </DashboardSection>
      </Grid>


      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        {/* <Tab label="All" /> */}
        <Tab label="Community" />
        <Tab label="Messages" />
        <Tab label="Lessons" />
        <Tab label="Campaigns" />
        <Tab label="Payments" />
        {user.level === 101 || user.level === 100 && <Tab label="Admin" />}
      </Tabs>

      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 2 }} spacing={2} sx={{ margin: 'auto auto' }}>
        {(activeTab === 0) && (
          <>

            <Grid size={{ xs: 12, md: 4, lg: 12 }} sx={{ display: 'flex', flexDirection: 'column', gap: '3%', p: 5 }}>
              <Events />
              {/* </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 5 }}> */}
              <DashboardSection>
                <SectionTitleWithIcon variant="h5" mb={2}>🎉 Share an Event</SectionTitleWithIcon>
                <CardContent>
                  <EventForm />
                </CardContent>
              </DashboardSection>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Birthdays />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DonationCard />
            </Grid>
          </>
        )}


        {(activeTab === 1) && (
          <Grid size={{ xs: 12, md: 4 }}>
            <DashboardSection>
              <SectionTitleWithIcon variant="h5"><List size={20} />Messages from the Community</SectionTitleWithIcon>
              <CardContent>
                <PublicMessages />
              </CardContent>
            </DashboardSection>
          </Grid>
        )}


        {(activeTab === 2) && (
          <Grid size={{ xs: 6, sm: 6, md: 4, xl: 6 }}  >
            <DashboardSection>

              <SectionTitleWithIcon><Clock size={20} /> Time of Lessons</SectionTitleWithIcon>

              <CardContent style={{ maxHeight: '300px', overflowY: 'auto', padding: '15px' }}>

                <LessonsList lessons={lessons} />

              </CardContent>

              <Lesson lessons={lessons} setLessons={setLessons} />

            </DashboardSection>
          </Grid>
        )}



        {(activeTab === 3) && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>

            <DashboardSection>
              <SectionTitleWithIcon variant="h5"><Award size={20} />Campaigns</SectionTitleWithIcon>

              <CardContent>
              </CardContent>
              <Button
                variant="outlined"
                onClick={() => setIsInsertingCampaign(!isInsertingCampaign)}
                sx={{
                  marginTop: '10px',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                  },
                  '&:focus': {
                    boxShadow: '0 0 5px 2px rgba(0, 123, 255, 0.5)',
                  }
                }}
              >
                {isInsertingCampaign ? 'Cancel' : 'Start New Campaign'} <PlusCircle size={16} style={{ marginLeft: '5px' }} />
              </Button>

              {isInsertingCampaign && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <Paper style={{ padding: '15px', marginTop: '10px', backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" style={{ marginBottom: '10px' }}>Insert New Campaign</Typography>

                    <Campaign />

                  </Paper>
                </motion.div>
              )}

            </DashboardSection>
          </Grid>

        )}



        {(activeTab === 4) && (
          <Grid size={{ /*xs: 6, sm: 6, md: 4, xl: 12, lg: 6*/xs: 12, md: 4, lg: 12, xl: 10 }}>
            <DashboardSection>
              <CardContent>
                <QuickAddPayment setPayments={setPayments} />
                <PaymentsTable payments={payments} />
              </CardContent>
            </DashboardSection>
          </Grid>
        )}



        {(activeTab === 5) && (
          <Grid size={{ xs: 6, sm: 6, md: 4, xl: 12, lg: 6 }}>
            <DashboardSection>
              <CardContent>
                <GuestMessages />
              </CardContent>
            </DashboardSection>
          </Grid>
        )}


      </Masonry>


      {/* <Grid container spacing={3} sx={{ mt: 15 }}>

      </Grid> */}

    </Box >
  )
}

export default Home;
import React, { useState } from 'react';
import '../App.css';
import { Button, CardContent, Typography, Grid, Paper, styled, Box, Tabs, Tab, useMediaQuery } from '@mui/material';
import Campaign from '../components/Campaign';
import { PlusCircle, List } from 'lucide-react';
import Lesson from '../components/Lessons/Lesson';
import Scheduler from '../components/Scheduler';
import CandlelightingTimes from '../components/CandleLightingTimes';
import LessonsList from '../components/Lessons/LessonsList';
import useLessons from '../components/Lessons/useLessons';
import Birthdays from '../components/Birthdays';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';
import GuestMessages from '../components/GuestsMessages';
import { useAppUser } from '../context/AppUser.context';
import Events from '../components/Events/Events';
import PublicMessages from '../components/PublicMessages';
import EventForm from '../components/Events/EventForm';
import { Masonry } from '@mui/lab';
import DonationCard from '../components/DonationCard';
import Syn from '../assets/home_background.jpg';
import Payments from '../components/Payments/Payments';
import WhatsappButton from '../components/WhatsappButton';
import UserManagementTable from '../components/UserManagementTable';
import SpecialEvent from '../components/SpecialEvent';
import { useTranslation } from 'react-i18next';

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


const Home: React.FC = () => {
  const [isInsertingCampaign, setIsInsertingCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const isMobile = useMediaQuery('(max-width:600px)');

  const { t } = useTranslation();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const { lessons, setLessons } = useLessons();

  const { user } = useAppUser();

  return (


    <Box sx={{ padding: '20px' }}>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          '&::before': {
            content: '""',
            position: 'fixed', // ✅ fix the background in place
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${Syn})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(5px)',
            zIndex: 0,
            pointerEvents: 'none', // allows interaction with page content
          },
          '&::after': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            zIndex: 0,
            pointerEvents: 'none',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, color: '#fff', p: 4 }}>



          <Grid size={{ xs: 6, sm: 6, md: 4, xl: 6, lg: 10 }}>
            <DashboardSection
              elevation={3}
              sx={{
                backgroundColor: '#f0fdfa',
                borderRadius: 3,
                maxWidth: 480,
                margin: 'auto',
                padding: 3,
                background: 'rgba(240, 253, 250, 0.8)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                <Scheduler />

                <CandlelightingTimes />

              </CardContent>
            </DashboardSection>
          </Grid>


          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="secondary"
            indicatorColor="primary"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)',
              px: 1,
            }}
          >
            {/* <Tab label="All" /> */}
            <Tab label={t('home.tabs.community')} sx={{ color: 'white', }} />
            <Tab label={t('home.tabs.messages')} sx={{ color: 'white' }} />
            <Tab label={t('home.tabs.lessons')} sx={{ color: 'white' }} />
            <Tab label={t('home.tabs.campaigns')} sx={{ color: 'white' }} />
            <Tab label={t('home.tabs.payments')} sx={{ color: 'white' }} />
            <Tab label={t('home.tabs.kehilla')} sx={{ color: 'white' }} />
            {user.level === 101 || user.level === 100 && <Tab label={t('home.tabs.admin')} sx={{ color: 'blue' }} />}
          </Tabs>

          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 2 }} spacing={2} sx={{ margin: 'auto auto' }}>


            {(activeTab === 0) && (
              <>

                <Grid size={{ xs: 12, md: 4, lg: 12 }} sx={{ display: 'flex', flexDirection: 'column', gap: '3%', p: isMobile ? 0 : 5 }}>

                  <Events />

                  <DashboardSection>
                    <SectionTitleWithIcon variant="h5" mb={2}>{t('home.sections.share_event')}</SectionTitleWithIcon>
                    <CardContent >
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

                <Grid size={{ lg: 12, xs: 10, sm: 6, md: 4 }}>
                  <SpecialEvent />
                </Grid>
              </>
            )}


            {(activeTab === 1) && (
              <Grid size={{ xs: 12, md: 4 }}>
                <DashboardSection>
                  <SectionTitleWithIcon variant="h5"><List size={20} />{t('home.sections.public_messages')}</SectionTitleWithIcon>
                  <CardContent>
                    <PublicMessages />
                  </CardContent>
                </DashboardSection>
              </Grid>
            )}


            {(activeTab === 2) && (
              <Grid size={{ xs: 6, sm: 6, md: 4, xl: 6 }}  >
                <DashboardSection>

                  <SectionTitleWithIcon>{t('home.sections.lessons_title')}</SectionTitleWithIcon>

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
                  <SectionTitleWithIcon variant="h5">{t('home.sections.campaigns_title')}</SectionTitleWithIcon>
                  <Button
                    variant="outlined"
                    onClick={() => setIsInsertingCampaign(!isInsertingCampaign)}
                    sx={{
                      mt: 2,
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                      '&:focus': {
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.3)',
                      }
                    }}
                  >
                    {isInsertingCampaign ? t('home.sections.cancel_campaign') : t('home.sections.start_campaign')} <PlusCircle size={16} style={{ marginLeft: '5px' }} />
                  </Button>

                  {isInsertingCampaign && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

                      <Typography variant="h6" style={{ marginBottom: '10px' }}>{t('home.sections.insert_campaign')}</Typography>

                      <Campaign />

                    </motion.div>
                  )}

                </DashboardSection>
              </Grid>

            )}



            {(activeTab === 4) && (
              <Grid size={{ /*xs: 6, sm: 6, md: 4, xl: 12, lg: 6*/xs: 12, md: 4, lg: 12, xl: 10 }}>
                <DashboardSection>
                  <SectionTitleWithIcon variant="h5">{t('home.sections.payments_title')}</SectionTitleWithIcon>
                  <CardContent>
                    <Payments />
                  </CardContent>
                </DashboardSection>
              </Grid>
            )}



            {(activeTab === 5) && (
              <Grid size={{ xs: 6, sm: 6, md: 4, xl: 12, lg: 6 }}>
                <DashboardSection>
                  <SectionTitleWithIcon variant="h5">{t('home.sections.members_title')}</SectionTitleWithIcon>
                  <CardContent>
                    <UserManagementTable />
                  </CardContent>
                </DashboardSection>
              </Grid>
            )}


            {(activeTab === 6) && (
              <Grid size={{ xs: 6, sm: 6, md: 4, xl: 12, lg: 6 }}>
                <DashboardSection>
                  <CardContent>
                    <GuestMessages />
                  </CardContent>
                </DashboardSection>
              </Grid>
            )}
            <WhatsappButton />
          </Masonry>

        </Box >
      </Box>
    </Box>



  )
}

export default Home;
import React, { useEffect, useState } from 'react';
import '../App.css';
import { Button, CardContent, Typography, Grid, Paper, styled } from '@mui/material';
import Campaign from '../components/Campaign';
import { Clock, Award, List, PlusCircle } from 'lucide-react';
import { DayPicker } from "react-day-picker";
import Lesson from '../components/Lessons/Lesson';
import Scheduler from '../components/Scheduler';
import CandlelightingTimes from '../components/CandleLightingTimes';
import LessonsList from '../components/Lessons/LessonsList';
import PaymentManagement from '../components/PaymentManagement';
import useLessons from '../components/Lessons/useLessons';
import Birthdays from '../components/Birthdays';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';

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

  const { lessons, setLessons } = useLessons();

  return (
    <div style={{ padding: '20px' }}>


      {/* <PaymentManagement /> */}

      <Grid container spacing={3} sx={{ mt: 15 }}>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}  >

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DashboardSection>

              <SectionTitleWithIcon><Clock size={20} /> Time of Lessons</SectionTitleWithIcon>

              <CardContent style={{ maxHeight: '300px', overflowY: 'auto', padding: '15px' }}>

                <LessonsList lessons={lessons} />

              </CardContent>

              <Lesson lessons={lessons} setLessons={setLessons} />

            </DashboardSection>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardSection style={{ backgroundColor: '#e0f7fa' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

              <CandlelightingTimes />

              <Scheduler />

            </CardContent>
          </DashboardSection>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>

          <DashboardSection>
            <SectionTitleWithIcon variant="h5"><Award size={20} />Campaigns</SectionTitleWithIcon>
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
            <CardContent>
            </CardContent>
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

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Birthdays />
        </Grid>


        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardSection>
            <SectionTitleWithIcon variant="h5"><Clock size={20} /> Time of Lessons</SectionTitleWithIcon>
            <CardContent>
              {/* Time of lessons content here */}
              <Typography variant="body2">Display today's or the week's lesson schedule.</Typography>
            </CardContent>
          </DashboardSection>
        </Grid>


        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DashboardSection>
            <SectionTitleWithIcon variant="h5"><List size={20} />To-Do List</SectionTitleWithIcon>
            <CardContent>
              <Typography variant="body2">Display user's to-do list.</Typography>
            </CardContent>
          </DashboardSection>
        </Grid>


      </Grid>
    </div >




    // <React.Fragment>
    //   <Box>

    //     <Campaign />

    //   </Box>

    //   <Footer />
    // </React.Fragment>
  )
}


const StyledDayPicker = styled(DayPicker)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // border: `1.4px solid ${theme.palette.divider}`, // Use theme's divider
  borderRadius: '8px',
  padding: theme.spacing(2),
  // boxShadow: theme.shadows[2],              // Add shadow for depth
  backgroundColor: theme.palette.background.paper, // Use theme's background
  height: 'auto',
  width: 'auto',
  maxWidth: '450px',

  '.rdp-head': {
    color: theme.palette.text.primary,
    fontWeight: '600',
    paddingBottom: theme.spacing(1),
  },
  '.rdp-nav': {
    marginBottom: theme.spacing(1),
  },
  '.rdp-nav-button': {
    color: theme.palette.action.active,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '.rdp-month': {
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
  },
  '.rdp-table': {
    borderCollapse: 'collapse',
    border: 'none',
    margin: 0,
  },

  '.rdp-tbody': {
    border: 'none'
  },
  '.rdp-day': {
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.primary.main,
      transform: 'scale(1.05)',
    },
    '&[aria-selected="true"]': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    '&:disabled': {
      color: theme.palette.text.disabled,
      backgroundColor: 'transparent',
      cursor: 'default',
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.text.disabled,
      },
    },
  },
  '.rdp-caption': {
    paddingTop: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    textAlign: 'center',
  },

}));

type Props = {
  onChange: (day: any) => void
  selected: any
}
function MyDatePicker({ selected, onChange }: Props) {

  return (
    <StyledDayPicker
      mode="single"
      selected={selected}
      onSelect={day => onChange(day)}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="textSecondary">
            {selected ? `Selected: ${selected}` : "Pick a day."}
          </Typography>
          <Button variant="text" onClick={() => onChange(null)}>
            Clear
          </Button>
        </div>
      }
    />
  );
}


export default Home;
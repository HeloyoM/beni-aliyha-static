import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import { Button } from '@mui/material';
import Campaign from '../components/Campaign';
import { CardContent, Typography, Grid, Paper, styled } from '@mui/material';
import { Cake, Clock, Award, Calendar as CalendarIcon, List, PlusCircle } from 'lucide-react';
import AppUserContext from '../context/AppUserContext';
import { getLessons } from '../api/lesson';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import ILesson from '../interfaces/ILesson.interface';
import Lesson from '../components/Lesson';
import Scheduler from '../components/Scheduler';
import CandlelightingTimes from '../components/CandleLightingTimes';

// Styled components for consistent styling
const DashboardSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[1],
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

const Home: React.FC = () => {
  const [lessons, setLessons] = useState<ILesson[]>([]);

  const [isInsertingLesson, setIsInsertingLesson] = useState(false);
  const [isInsertingCampaign, setIsInsertingCampaign] = useState(false);

  const { user } = useContext(AppUserContext);

  useEffect(() => {

    const fetchLessonsData = async () => {
      try {
        const response = await getLessons();
        const data = response.data as any;
        setLessons(data);
      } catch (error: any) {
        console.error("Error fetching lessons:", error);
        setLessons([]);
      }
    };
    fetchLessonsData();

  }, [lessons]);

  const canEdit = user && (user.level === 100 || user.level === 101);

  // Helper function to calculate duration
  const getDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 'N/A';
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getNextLesson = (lessons: ILesson[]) => {
    const now = new Date();
    const upcomingLessons = lessons.filter(lesson => new Date(lesson.greg_date) >= now);
    if (upcomingLessons.length > 0) {
      upcomingLessons.sort((a, b) => new Date(a.greg_date).getTime() - new Date(b.greg_date).getTime());
      return upcomingLessons[0];
    }
    return null;
  };

  const nextLesson = getNextLesson(lessons);

  return (
    <div style={{ padding: '20px' }}>

      <Grid container spacing={3} sx={{ mt: 15 }}>

        <Grid size={6}>

          <DashboardSection >

            <SectionTitle><Clock size={20} /> Time of Lessons</SectionTitle>

            <CardContent style={{ maxHeight: '300px', overflowY: 'auto', padding: '15px' }}>

              {lessons.length > 0 ? (
                lessons.map((lesson) => {

                  const isNextLesson = nextLesson?.id === lesson.id;

                  return (
                    <motion.div
                      key={lesson.id}
                      style={{
                        borderRadius: '8px',
                        padding: '15px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                        fontWeight: isNextLesson ? 'bold' : 'normal', // Bold the next lesson
                      }}
                      whileHover={{ backgroundColor: '#f0f0f0' }}
                    >
                      <AnimatePresence>
                        {isInsertingLesson && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            <Typography variant="h6" style={{ color: '#ff6f00', marginBottom: '10px' }}>Lesson</Typography>

                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: isNextLesson ? 'bold' : 'normal',
                          color: '#2c3e50',
                        }}
                      >
                        {lesson.topic}
                      </Typography>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <Typography variant="body2" style={{ color: '#7f8c8d' }}>
                          Date: {lesson.greg_date}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#7f8c8d' }}>
                          Time: {lesson.start_time} - {lesson.end_time}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: isNextLesson ? 'bold' : 'normal',
                            color: '#34495e',
                          }}
                        >
                          ({getDuration(lesson.start_time, lesson.end_time)})
                        </Typography>
                      </div>
                      {lesson.description && (
                        <Typography variant="body2" style={{ fontStyle: 'italic', color: '#95a5a6' }}>
                          {lesson.description}
                        </Typography>
                      )}
                      {lesson.teacher && (
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: isNextLesson ? 'bold' : 'normal',
                            color: '#2c3e50',
                          }}
                        >
                          Teacher: {lesson.teacher}
                        </Typography>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <Typography variant="body2">No lessons scheduled.</Typography>
              )}
            </CardContent>

            {canEdit && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setIsInsertingLesson(!isInsertingLesson)}
                  style={{ marginTop: '10px' }}
                >
                  {isInsertingLesson ? 'Cancel' : 'Create New Lesson'} <PlusCircle size={16} style={{ marginLeft: '5px' }} />
                </Button>

                {isInsertingLesson && (
                  <Paper style={{ padding: '15px', marginTop: '10px', backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" style={{ marginBottom: '10px' }}>Insert New Lesson</Typography>

                    <Lesson lessons={lessons} setLessons={setLessons} />

                  </Paper>
                )}
              </>
            )}
          </DashboardSection>
        </Grid>

        <Grid size={6}>
          <DashboardSection style={{ backgroundColor: '#e0f7fa' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            <CandlelightingTimes />

              <Scheduler />

            </CardContent>
          </DashboardSection>
        </Grid>

        <Grid size={10}>

          <DashboardSection>
            <SectionTitle><Award size={20} />Campaigns</SectionTitle>
            <Button
              variant="outlined"
              onClick={() => setIsInsertingCampaign(!isInsertingCampaign)}
              style={{ marginTop: '10px' }}
            >
              {isInsertingCampaign ? 'Cancel' : 'Start New Campaign'} <PlusCircle size={16} style={{ marginLeft: '5px' }} />
            </Button>
            <CardContent>
            </CardContent>
            {isInsertingCampaign && (
              <Paper style={{ padding: '15px', marginTop: '10px', backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6" style={{ marginBottom: '10px' }}>Insert New Campaign</Typography>

                <Campaign />

              </Paper>
            )}

          </DashboardSection>

        </Grid>

        <Grid size={2}>
          <DashboardSection>
            <SectionTitle><Cake size={20} /> Birthdays</SectionTitle>
            <CardContent>
              {/* Birthdays content here */}
              <Typography variant="body2">Show upcoming birthdays of students or staff.</Typography>
            </CardContent>
          </DashboardSection>
        </Grid>
        <Grid size={3}>
          <DashboardSection>
            <SectionTitle><Clock size={20} /> Time of Lessons</SectionTitle>
            <CardContent>
              {/* Time of lessons content here */}
              <Typography variant="body2">Display today's or the week's lesson schedule.</Typography>
            </CardContent>
          </DashboardSection>
        </Grid>


        <Grid size={12}>
          <DashboardSection>
            <SectionTitle><List size={20} />To-Do List</SectionTitle>
            <CardContent>
              <Typography variant="body2">Display user's to-do list.</Typography>
            </CardContent>
          </DashboardSection>
        </Grid>


      </Grid>
    </div>




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
    transition: 'background-color 0.3s, color 0.3s',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.primary.main,
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
        <Typography variant="caption" color="textSecondary">
          {selected ? `Selected: ${selected}` : "Pick a day."}
        </Typography>
      }
    />
  );
}


export default Home;
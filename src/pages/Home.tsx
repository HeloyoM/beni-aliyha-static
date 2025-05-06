import React, { useEffect, useState } from 'react';
import '../App.css';
import { Button, Card } from '@mui/material';
import Campaign from '../components/Campaign';
import { CardContent, Typography, Grid, Paper, styled } from '@mui/material';
import { Cake, Clock, Award, List, PlusCircle } from 'lucide-react';
import { useAppUser } from '../context/AppUser.context';
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import Lesson from '../components/Lessons/Lesson';
import Scheduler from '../components/Scheduler';
import CandlelightingTimes from '../components/CandleLightingTimes';
import LessonsList from '../components/Lessons/LessonsList';
import PaymentManagement from '../components/PaymentManagement';
import useLessons from '../components/Lessons/useLessons';
import IUser from '../interfaces/User.interface';
import { format, isToday, isFuture } from 'date-fns';
import { getAllUsers } from '../api/user';

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
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<IUser[]>([]);
  const [todayBirthdays, setTodayBirthdays] = useState<IUser[]>([]);

  const [isInsertingCampaign, setIsInsertingCampaign] = useState(false);

  const { lessons, setLessons } = useLessons();
  console.log({ users })
  useEffect(() => {
    if (!!users.length) return

    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();

        const data = response.data as any;
        if (response.status !== 200) {
          throw new Error(data.message || 'Failed to fetch users');
        }

        setUsers(data.users);

      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchUsers();
  }, [users]);

  useEffect(() => {
    const todayBirthdays = users.filter(user => {
      if (!user.birthday) return false;
      const userBirthday = new Date(user.birthday);
      return isToday(userBirthday);
    });

    const upcomingBirthdays = users.filter(user => {
      if (!user.birthday) return false;
      const userBirthday = new Date(user.birthday);
      return isFuture(userBirthday);
    }).sort((a, b) => {
      const dateA = new Date(a.birthday!).getTime();
      const dateB = new Date(b.birthday!).getTime();
      return dateA - dateB;
    });

    setTodayBirthdays(todayBirthdays);
    setUpcomingBirthdays(upcomingBirthdays);

  }, [users]);

  return (
    <div style={{ padding: '20px' }}>


      {/* <PaymentManagement /> */}

      <Grid container spacing={3} sx={{ mt: 15 }}>

        <Grid size={6}>

          <DashboardSection >

            <SectionTitle><Clock size={20} />Time of Lessons</SectionTitle>

            <CardContent style={{ maxHeight: '300px', overflowY: 'auto', padding: '15px' }}>

              <LessonsList lessons={lessons} />

            </CardContent>

            <Lesson lessons={lessons} setLessons={setLessons} />

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
          <Card>
            <CardContent>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <Cake style={{ marginRight: 5, height: 20, width: 20 }} /> Birthdays Today
              </Typography>
              {todayBirthdays.length > 0 ? (
                <ul>
                  {todayBirthdays.map(user => (
                    <li key={user.id}>
                      {user.first_name} {user.last_name} ({format(new Date(user.birthday!), 'PPP')})
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2">No birthdays today.</Typography>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <Cake style={{ marginRight: 5, height: 20, width: 20 }} /> Upcoming Birthdays
              </Typography>
              {upcomingBirthdays.length > 0 ? (
                <ul>
                  {upcomingBirthdays.map(user => (
                    <li key={user.id}>
                      {user.first_name} {user.last_name} ({format(new Date(user.birthday!), 'PPP')})
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2">No upcoming birthdays.</Typography>
              )}
            </CardContent>
          </Card>

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
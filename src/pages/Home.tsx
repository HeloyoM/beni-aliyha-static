import React, { JSX, useCallback, useEffect, useState } from 'react';
import '../App.css';
import { Button, Select, CardContent, Typography, Grid, Paper, styled, Box, CircularProgress, Card, Chip, CardHeader, Avatar, TextField, FormControl, MenuItem, InputLabel, Alert, FormHelperText, ListItemIcon, ListItemText } from '@mui/material';
import Campaign from '../components/Campaign';
import { Clock, Award, PlusCircle, List } from 'lucide-react';
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
import { getMessages } from '../api/message';
import { createNewEvent, getCommunityEvents, getEventsTypes } from '../api/events';
import { Baby, Heart, Home as HomeIcon, Cake, Briefcase, Star, GraduationCap, Gem, CalendarHeart } from 'lucide-react';
import { useFormik } from 'formik';
import { getAllUsers } from '../api/user';
import IUser from '../interfaces/User.interface';
import { CalOptions, HDate, HebrewDateEvent, Location } from '@hebcal/core';

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

interface Payment {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const eventIcons: Record<string, JSX.Element> = {
  'baby-boy': <Baby />,
  'baby-girl': <Baby />,
  'wedding': <Gem />,
  'engagement': <Heart />,
  'new-job': <Briefcase />,
  'housewarming': <HomeIcon />,
  'birthday': <Cake />,
  'anniversary': <CalendarHeart />,
  'graduation': <GraduationCap />,
  'bar-mitzvah': <Star />,
};

interface CommunityEvent {
  id: string;
  description: string;
  created_at: string;
  greg_date: string;
  hebrew_date: string;
  icon: string;
  color: string;
  type: string
  user: {
    name: string;
    id: string;
    email: string;
  };
}

type EventType = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

const Home: React.FC = () => {
  const [publicMessages, setPublicMessages] = useState<any[]>([]);
  const [isInsertingCampaign, setIsInsertingCampaign] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [newEvent, setNewEvent] = useState('');
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const { lessons, setLessons } = useLessons();

  const { canEditPayments, canPublishMessages } = useAppUser();


  useEffect(() => {
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

    if (canPublishMessages) {
      fetchUsers();
    }
  }, [canPublishMessages]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getCommunityEvents();

      const data = response.data as any;

      setEvents(data);

      const res = await getEventsTypes();

      const types = res.data as any;

      setEventTypes(types);

    } catch (err) {
      console.error('Failed to fetch happy events');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchPublicMessages = async () => {
      try {
        const response = await getMessages();

        const data = response.data as any;

        const filtered = data.filter((msg: any) => Boolean(msg.is_public));
        setPublicMessages(filtered);
      } catch (error) {
        console.error('Failed to fetch public messages', error);
      }
    };

    fetchPublicMessages();
  }, []);




  // Fetch payments
  const fetchPayments = useCallback(async () => {
    try {
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
  }, [canEditPayments])

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const submitEvent = async (values: any) => {
    setLoading(true);
    setError(null);

    const gerg_date = new Date(values.greg_date)
    const now = new HDate(gerg_date);
    const year = now.getFullYear();

    const options: CalOptions = {
      year: year,
      isHebrewYear: false,
      location: Location.lookup('Tel Aviv'),
      month: now.getMonthName(),
    };

    const hd = new HDate(now.dd, options.month, options.year);

    const ev = new HebrewDateEvent(hd);

    values.greg_date = gerg_date.toLocaleDateString('en-GB');
    values.hebrew_date = ev.render('he');

    try {
      const response = await createNewEvent(values);

      const data = response.data as any;

      if (response.status === 201) {
        setSuccess(true);
        formik.resetForm();
      }
    } catch (err) {
      console.error('Failed to post an event');
    }
  }


  const formik = useFormik({
    initialValues: {
      description: '',
      user_id: null,
      type: 0,
      greg_date: '',
      hebrew_date: ''
    },
    onSubmit: submitEvent,
  });

  console.log(formik.values)
  return (
    <Box sx={{ padding: '20px' }}>


      <Grid container spacing={3} sx={{ mt: 15 }}>


        <Grid size={{ xs: 12, md: 4 }}>

          {loading ? (
            <CircularProgress />
          ) : (
            events.map(event => (
              <Grid size={{ xs: 12, md: 4 }} key={event.id}>
                <Card sx={{ mb: 2, borderLeft: `5px solid ${event.color}` }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: event.color }}>
                        {eventIcons[event.icon] || <Star />} {/* Fallback icon */}
                      </Avatar>
                    }
                    title={event.type}
                    subheader={`${event.greg_date} / ${event.hebrew_date}`}
                  />
                  <CardContent>
                    <Typography>{event.description}</Typography>
                  </CardContent>
                </Card>




              </Grid>
            ))
          )}


          {canPublishMessages && (

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Box mt={3} p={2} borderRadius={2} boxShadow={2} bgcolor="#f9f9f9">
                <Typography variant="h6" mb={2}>🎉 Share a Happy Event</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <form onSubmit={formik.handleSubmit}>
                    <InputLabel>Select Event Type</InputLabel>
                    <Select
                      label="type-label"
                      id="type"
                      name="type"
                      fullWidth
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ borderRadius: 8, borderColor: formik.touched.type && formik.errors.type ? '#d32f2f' : '#81c784' }}
                      renderValue={(selected) => {
                        const type = eventTypes.find((t) => String(t.id) === String(selected));
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{ width: 24, height: 24, bgcolor: type?.color }}
                              src={type?.icon}
                              alt={type?.name}
                            />
                            <Typography>{type?.name}</Typography>
                          </Box>
                        );
                      }}
                    >
                      {eventTypes.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          <ListItemIcon>
                            <Avatar
                              src={t.icon}
                              sx={{ width: 24, height: 24, bgcolor: t.color }}
                              alt={t.name}
                            >
                              {eventIcons[t.icon] || <Star />}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText primary={t.name} />
                        </MenuItem>
                      ))}
                    </Select>


                    <TextField
                      label="What's the event?"
                      fullWidth
                      name="description"
                      multiline
                      minRows={3}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      label='date'
                      sx={{ width: 'auto', height: 55 }}
                      type="date"
                      name="greg_date"
                      InputLabelProps={{ shrink: true }}
                      value={formik.values.greg_date}
                      onChange={formik.handleChange}
                    />


                    <Select
                      label="member"
                      id="type"
                      name="user_id"
                      fullWidth
                      value={formik.values.user_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ borderRadius: 8, borderColor: formik.touched.type && formik.errors.type ? '#d32f2f' : '#81c784' }}
                    >
                      {users.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.first_name + ' ' + u.last_name}
                        </MenuItem>
                      ))}
                    </Select>


                    {error && (
                      <Alert severity="error" style={{ marginBottom: 10 }}>
                        {error}
                      </Alert>
                    )}
                    {success && (
                      <Alert severity="success" style={{ marginBottom: 10 }}>
                        Event published successfully!
                      </Alert>
                    )}

                    <Button type="submit" disabled={loading} variant="contained" color="primary">
                      Publish Event
                    </Button>
                  </form>
                </FormControl>

              </Box>
            </motion.div>
          )}
        </Grid>




        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardSection>
            <SectionTitleWithIcon variant="h5"><List size={20} />Messages from the Community</SectionTitleWithIcon>
            <CardContent>
              {publicMessages.length > 0 ? (
                publicMessages.map((msg, index) => (
                  <Paper key={index} elevation={1} sx={{ p: 2, mb: 1, backgroundColor: '#fefefe' }}>
                    <Typography variant="body1" color="text.primary">{msg.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      — {msg.user?.name || 'Anonymous'}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No public messages yet.</Typography>
              )}
            </CardContent>
          </DashboardSection>
        </Grid>






        <Grid size={{ xs: 6, sm: 6, md: 4, xl: 12, lg: 6 }}>
          <DashboardSection>
            <CardContent>
              <GuestMessages />
            </CardContent>
          </DashboardSection>
        </Grid>





        <Grid size={{ xs: 6, sm: 6, md: 4, xl: 6 }}  >

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




        <Grid size={{ xs: 6, sm: 6, md: 4, xl: 6 }}>
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




        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}> */}
        {/* <DashboardSection> */}
        {/* <SectionTitleWithIcon variant="h5"><List size={20} />Payments</SectionTitleWithIcon> */}
        {/* <CardContent> */}
        {/* </CardContent> */}
        {/* </DashboardSection> */}
        {/* </Grid> */}


      </Grid>

      <Box>
        <Button
          variant="outlined"
          onClick={() => setShowPayments((prev) => !prev)}
        >
          {showPayments ? 'Hide Payments' : 'Manage Payments'}
        </Button>

        {showPayments && (
          <>
            <QuickAddPayment />
            <PaymentsTable payments={payments} />
          </>
        )}
      </Box>

    </Box >
  )
}


const StyledDayPicker = styled(DayPicker)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '8px',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
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
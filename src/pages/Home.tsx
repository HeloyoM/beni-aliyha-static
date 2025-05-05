import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Campaign from '../components/Campaign';
import { CardContent, Typography, Grid, Paper, styled } from '@mui/material';
import { Cake, Clock, Tv, Calendar as CalendarIcon, List, PlusCircle } from 'lucide-react';
import { CalOptions, HDate, HebrewCalendar, HebrewDateEvent, Location } from '@hebcal/core';
import AppUserContext from '../context/AppUserContext';
import { getSchedules, insertSchedule } from '../api/schedule';
import { createLesson, getLessons } from '../api/lesson';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import ILesson from '../interfaces/ILesson.interface';
import Lesson from '../components/Lesson';

const now = new HDate();
const year = now.getFullYear();
const today = new Date();

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

interface ParashaType {
  date: string | undefined
  hebrewDate: string
  event: string
  emoji?: string | null
}

interface ScheduleEntry {
  id: number;
  greg_date: string;
  hebrew_date: string;
  mincha_time: string | null;
  shacharis_time: string | null;
  maariv_time: string | null;
}



const Home: React.FC = () => {
  const [sedarot, setSedarot] = useState<ParashaType[]>([]);
  const [candlelighting, setCandlelighting] = useState<ParashaType[]>([])
  const [selectedParasha, setSelectedParasha] = React.useState<ParashaType>();
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleEntry | null>(null);
  const [editedData, setEditedData] = useState<Partial<ScheduleEntry>>({});
  const [lessons, setLessons] = useState<ILesson[]>([]);

  const [isInsertingLesson, setIsInsertingLesson] = useState(false);
  const [isInsertingCampaign, setIsInsertingCampaign] = useState(false);

  const { user } = useContext(AppUserContext);

  // Fetch initial data and set states
  useEffect(() => {

    const events = HebrewCalendar.calendar({
      year: year,
      isHebrewYear: true,
      il: true,
      sedrot: true,
      candlelighting: true,
      location: Location.lookup('Jerusalem')
    });

    const candles = events
      .filter(ev => ev.getCategories().includes('candles') && ev.getDate().greg() >= today)
      .map(ev => ({
        date: ev.getDate().greg().toLocaleDateString(),
        hebrewDate: ev.getDate().renderGematriya(),
        event: ev.render('he'),
        emoji: ev.getEmoji()
      }));
    setCandlelighting(candles);

    const parashot: ParashaType[] = events
      .filter(ev => ev.getCategories().includes('parashat') && ev.getDate().greg() >= today)
      .map(ev => ({
        date: ev.getDate().greg().toLocaleDateString(),
        hebrewDate: ev.getDate().renderGematriya(),
        event: ev.render('he'),
        emoji: ev.getEmoji()
      }));

    setSedarot(parashot);
    setSelectedParasha(parashot[0] || { date: undefined, event: '', hebrewDate: '' });

    const fetchScheduleData = async () => {
      try {
        const response = await getSchedules();
        const data = response.data as any;
        console.log({ data })
        setScheduleData(data);
      } catch (error: any) {
        console.error("Error fetching schedule data:", error);
        setScheduleData([]);
      }
    };

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
    fetchScheduleData();

  }, [today]);

  console.log({ sedarot })

  const handleSelectedParash = (name: string) => {
    const par = sedarot.find(p => p.event.trim() === name.trim())

    if (par) {
      setSelectedParasha(par)
    }
  }

  const handleSaveEdit = async () => {
    try {
      if (!selectedParasha) return

      const hDate = new HDate(new Date());
      const hebrewDateString = hDate.toString();

      const payload = {
        mincha_time: editedData.mincha_time!,
        maariv_time: editedData.maariv_time!,
        shacharis_time: editedData.shacharis_time!,
        greg_date: selectedParasha.date!,
        hebrew_date: selectedParasha.hebrewDate!
      }

      const response = await insertSchedule(payload)

      const data = response.data as any;

      setScheduleData(scheduleData.map(item =>
        item.id === editingItem?.id ? { ...item, ...editedData, hebrew_date: hebrewDateString } : item
      ));

      handleCloseEdit();

    } catch (error: any) {
      console.error("Error saving edit:", error);
    }
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleEdit = (item: ScheduleEntry) => {
    setEditingItem(item);
    setEditedData({
      mincha_time: item.mincha_time,
      shacharis_time: item.shacharis_time,
      maariv_time: item.maariv_time
    })
    setIsEditDialogOpen(true);
  };

  const canEdit = user && (user.level === 100 || user.level === 101);

  // Function to get the schedule for a given date
  const getScheduleForDate = (date: string) => {
    return scheduleData.find(item => item.greg_date === date) || {
      id: 0,
      greg_date: date,
      hebrew_date: '',
      mincha_time: null,
      shacharis_time: null,
      maariv_time: null
    };
  };
  const selectedSchedule = selectedParasha ? getScheduleForDate(selectedParasha.date || sedarot[0].date!) : null;

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
                        // overflow: 'hidden', // Ensure content doesn't overflow during animation
                        // marginBottom: isInsertingLesson ? '15px' : '0px',
                        // padding: isInsertingLesson ? '12px' : '0px', // Conditional padding
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
                  {isInsertingLesson ? 'Cancel' : 'Insert New Lesson'} <PlusCircle size={16} style={{ marginLeft: '5px' }} />
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
            {candlelighting.length && (
              <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                Candle Lighting:
                <Typography fontWeight="bold"> {candlelighting[0].event}</Typography>
                {candlelighting[0].emoji}
              </Typography>
            )}
            {sedarot.length && (
              <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                Parashat:
                <Typography fontWeight="bold"> {sedarot[0].event}</Typography>
              </Typography>
            )}
            {user && user.level === 100 && selectedParasha && (
              <FormControl fullWidth>
                <InputLabel id="parasha-select-label">Parasha</InputLabel>
                <Select
                  labelId="parasha-select-label"
                  id="parasha-select"
                  name="parasha"
                  defaultValue={sedarot[0].event}
                  value={selectedParasha.event}
                  onChange={(e) => handleSelectedParash(e.target.value)}
                >
                  {sedarot.map((option) => (
                    <MenuItem key={option.event} value={option.event}>
                      {option.event}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <SectionTitle fontWeight="bold"><CalendarIcon size={20} />זמני התפילות</SectionTitle>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {selectedSchedule && (
                <div>
                  <Typography variant="body2">
                    Mincha:
                    {canEdit ? (
                      <input
                        type="text"
                        style={{
                          width: '50px',
                          marginLeft: '8px',
                          textAlign: 'center',
                          border: 'none',
                          borderBottom: '1px solid #000',
                          outline: 'none',
                        }}
                        name="mincha_time"
                        value={editedData.mincha_time || selectedSchedule.mincha_time || ''}
                        onChange={handleInputChange}

                      />
                    ) : (
                      <span style={{ marginLeft: '8px' }}>{selectedSchedule.mincha_time || 'N/A'}</span>
                    )}
                  </Typography>
                  <Typography variant="body2">
                    Shacharis:
                    {canEdit ? (
                      <input
                        type="text"
                        style={{
                          width: '50px',
                          marginLeft: '8px',
                          textAlign: 'center',
                          border: 'none',
                          borderBottom: '1px solid #000',
                          outline: 'none',
                        }}
                        name="shacharis_time"
                        value={editedData.shacharis_time || selectedSchedule.shacharis_time || ''}
                        onChange={handleInputChange}

                      />
                    ) : (
                      <span style={{ marginLeft: '8px' }}>{selectedSchedule.shacharis_time || 'N/A'}</span>
                    )}
                  </Typography>
                  <Typography variant="body2">
                    Maariv:
                    {canEdit ? (
                      <input
                        type="text"
                        style={{
                          width: '50px',
                          marginLeft: '8px',
                          textAlign: 'center',
                          border: 'none',
                          borderBottom: '1px solid #000',
                          outline: 'none',
                        }}
                        name="maariv_time"
                        value={editedData.maariv_time || selectedSchedule.maariv_time || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span style={{ marginLeft: '8px' }}>{selectedSchedule.maariv_time || 'N/A'}</span>
                    )}
                  </Typography>
                  {canEdit && (
                    <Button style={{ marginTop: 16, cursor: 'pointer' }} onClick={() => {
                      handleEdit(selectedSchedule);
                      setIsEditDialogOpen(true);
                    }}>
                      Click to edit
                    </Button>
                  )}
                  {!canEdit && (<Typography variant="body2" style={{ marginTop: 16 }}>
                    Display upcoming events, appointments, etc.
                  </Typography>)}
                </div>
              )}
            </CardContent>
          </DashboardSection>
        </Grid>

        <Grid size={10}>

          <DashboardSection>
            <SectionTitle><Tv size={20} /> Campaigns</SectionTitle>
            <Button
              variant="outlined"
              onClick={() => setIsInsertingCampaign(!isInsertingCampaign)}
              style={{ marginTop: '10px' }}
            >
              {isInsertingCampaign ? 'Cancel' : 'Insert New Campaign'} <PlusCircle size={16} style={{ marginLeft: '5px' }} />
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

        <Dialog open={isEditDialogOpen} onClose={handleCloseEdit}>
          <DialogTitle>Edit Schedule Item</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid>
              </Grid>
              <Grid>
                <TextField
                  label="Mincha Time"
                  name="mincha_time"
                  value={editedData.mincha_time || ''}
                  onChange={handleInputChange}
                  type="time"
                />
              </Grid>
              <Grid>

              </Grid>
              <Grid>

              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Shacharis Time"
                  name="shacharis_time"
                  value={editedData.shacharis_time || ''}
                  onChange={handleInputChange}
                  type="time"
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Maariv Time"
                  name="maariv_time"
                  value={editedData.maariv_time || ''}
                  onChange={handleInputChange}
                  type="time"
                />
              </Grid>
              <Grid >

              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
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
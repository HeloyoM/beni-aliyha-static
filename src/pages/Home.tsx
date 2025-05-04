import React, { useContext, useEffect, useRef, useState } from 'react';
import '../App.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Footer from '../components/Footer';
import Campaign from '../components/Campaign';
import { CardContent, Typography, Grid, Paper, styled } from '@mui/material';
import { Cake, Clock, Tv, Calendar as CalendarIcon, List } from 'lucide-react';
import { HDate, HebrewCalendar, Location } from '@hebcal/core';
import AppUserContext from '../context/AppUserContext';
import { getSchedules, insertSchedule } from '../api/schedule';

const now = new HDate();
const year = now.getFullYear();
const today = new Date();

const events = HebrewCalendar.calendar({
  year: year,
  isHebrewYear: true,
  il: true,     // אם אתה בארץ, תשנה ל-false
  sedrot: true,
  candlelighting: true,
  location: Location.lookup('Tel Aviv')
});

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

  const { user } = useContext(AppUserContext);

  // Refs for time inputs
  const minchaRef = useRef<HTMLInputElement | any>(null);
  const shacharisRef = useRef<HTMLInputElement | any>(null);
  const maarivRef = useRef<HTMLInputElement | any>(null);

  // // Fetch initial data and set states
  // useEffect(() => {
  //   const year = new HDate().getFullYear();
  //   const events = HebrewCalendar.calendar({
  //     year: year,
  //     isHebrewYear: true,
  //     il: true,
  //     sedrot: true,
  //     candlelighting: true,
  //     location: Location.lookup('Jerusalem')
  //   });

  //   const candles = events
  //     .filter(ev => ev.getCategories().includes('candles') && ev.getDate().greg() >= today)
  //     .map(ev => {
  //       const hdate = ev.getDate();
  //       return {
  //         date: hdate.greg().toLocaleDateString(),
  //         hebrewDate: hdate.renderGematriya(),
  //         event: ev.render('he'),
  //         emoji: ev.getEmoji()
  //       };
  //     });
  //   setCandlelighting(candles);

  //   const parashot: ParashaType[] = events
  //     .filter(ev => ev.getCategories().includes('parashat') && ev.getDate().greg() >= today)
  //     .map(ev => {
  //       const hdate = ev.getDate();
  //       return {
  //         date: hdate.greg().toLocaleDateString(),
  //         hebrewDate: hdate.renderGematriya(),
  //         event: ev.render('he'),
  //         emoji: ev.getEmoji()
  //       };
  //     });

  //   setSedarot(parashot);

  //   setSelectedParasha(parashot[0] || { date: undefined, event: '', hebrewDate: '' });

  //   // Fetch schedule data from the database
  //   const fetchScheduleData = async () => {
  //     try {
  //       const response = await getSchedules();

  //       const data = response.data as ScheduleEntry[];

  //       // Merge fetched data with initial data, prioritizing fetched data
  //       const mergedData = parashot.map((parasha) => {
  //         const dbEntry = data.find((item) => item.greg_date === parasha.date);
  //         return dbEntry
  //           ? {
  //             id: dbEntry.id,
  //             greg_date: dbEntry.greg_date,
  //             hebrew_date: dbEntry.hebrew_date,
  //             mincha_time: dbEntry.mincha_time || '19:30', // Default if null
  //             shacharis_time: dbEntry.shacharis_time || '07:00', // Default if null
  //             maariv_time: dbEntry.maariv_time || '21:00',   // Default if null
  //           }
  //           : { // Keep the initial data if not found in db
  //             id: 0, // Set a default ID for non-db entries
  //             greg_date: parasha.date!,
  //             hebrew_date: parasha.hebrewDate!,
  //             mincha_time: '19:30', // Or whatever your default is
  //             shacharis_time: '07:00',
  //             maariv_time: '21:00',
  //           };
  //       });
  //       setScheduleData(mergedData);

  //     } catch (error: any) {
  //       console.error("Error fetching schedule data:", error);
  //       // Handle error (e.g., show a message to the user)
  //       setScheduleData(parashot.map((parasha) => ({
  //         id: 0, // Set default ID
  //         greg_date: parasha.date!,
  //         hebrew_date: parasha.hebrewDate!,
  //         mincha_time: '19:30',
  //         shacharis_time: '07:00',
  //         maariv_time: '21:00'
  //       })))
  //     }
  //   };

  //   fetchScheduleData()
  //   // // Initialize schedule data (replace with your actual data fetching)
  //   // const initialScheduleData: ScheduleEntry[] = [{
  //   //   id: 1,
  //   //   greg_date: parashot[0].date!,
  //   //   hebrew_date: parashot[0].hebrewDate!,
  //   //   mincha_time: '19:30',
  //   //   shacharis_time: '07:00',
  //   //   maariv_time: '21:00'
  //   // }];

  //   // setScheduleData(initialScheduleData);
  // }, [today]);


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
        setScheduleData(data);
      } catch (error: any) {
        console.error("Error fetching schedule data:", error);
        setScheduleData([]);
      }
    };
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
      console.log({ data })
      // Update the data in the state
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

  const selectedSchedule = selectedParasha ? getScheduleForDate(selectedParasha.date || '') : null;

  return (
    <div style={{ padding: '20px' }}>

      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Home
      </Typography>

      <Grid container spacing={3}>

        <Grid size={6}>
          <DashboardSection >
            <SectionTitle><Clock size={20} /> Time of Lessons</SectionTitle>
            <CardContent>
              <Typography variant="body1">Display the most important information prominently.</Typography>
              <Typography variant="body2"> Perhaps show the full week schedule here.</Typography>
            </CardContent>
          </DashboardSection>
        </Grid>


        {/* <Grid size={6}>
          <DashboardSection style={{ backgroundColor: '#e0f7fa' }}>
            {candlelighting.length &&
              <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                Candle Lighting:
                <Typography fontWeight="bold"> {candlelighting[0].event}</Typography>
                {candlelighting[0].emoji}
              </Typography>}
            {sedarot.length &&
              <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                Parashat:
                <Typography fontWeight="bold"> {sedarot[0].event}</Typography>
              </Typography>}
            {user && user.level === 100 && selectedParasha &&
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
            }
            <SectionTitle fontWeight="bold"><CalendarIcon size={20} />זמני התפילות</SectionTitle>

            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div onClick={() => {
                if (canEdit) {
                  handleEdit(scheduleData.find(item => item.greg_date === editedData.greg_date) || scheduleData[0]);
                  setIsEditDialogOpen(true)
                }
              }}
                style={{ cursor: canEdit ? 'pointer' : 'default' }}
              >
                <Typography variant="body2">
                  Mincha:
                  <input
                    type="text"
                    style={{
                      width: '50px',
                      marginLeft: '8px',
                      cursor: canEdit ? 'pointer' : 'default',
                      textAlign: 'center',
                      border: 'none',
                      borderBottom: canEdit ? '1px solid #000' : 'none',
                      outline: 'none',
                    }}
                    ref={minchaRef}
                    value={editedData.mincha_time || ''}
                    readOnly={!canEdit}
                  />
                </Typography>

                <Typography variant="body2">
                  Shacharis:
                  <input
                    type="text"
                    style={{
                      width: '50px',
                      marginLeft: '8px',
                      cursor: canEdit ? 'pointer' : 'default',
                      textAlign: 'center',
                      border: 'none',
                      borderBottom: canEdit ? '1px solid #000' : 'none',
                      outline: 'none',
                    }}
                    ref={shacharisRef}
                    value={editedData.shacharis_time || ''}
                    readOnly={!canEdit}
                  />
                </Typography>
                <Typography variant="body2">
                  Maariv:
                  <input
                    type="text"
                    style={{
                      width: '50px',
                      marginLeft: '8px',
                      cursor: canEdit ? 'pointer' : 'default',
                      textAlign: 'center',
                      border: 'none',
                      borderBottom: canEdit ? '1px solid #000' : 'none',
                      outline: 'none',
                    }}
                    ref={maarivRef}
                    value={editedData.maariv_time || ''}
                    readOnly={!canEdit}
                  />
                </Typography>
                <Typography variant="body2" style={{ marginTop: 16 }}>
                  Display upcoming events, appointments, etc.
                </Typography>
              </div>
            </CardContent>
          </DashboardSection>
        </Grid> */}

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
                    <Typography variant="body2" style={{ marginTop: 16, cursor: 'pointer' }} onClick={() => {
                      handleEdit(selectedSchedule);
                      setIsEditDialogOpen(true);
                    }}>
                      Click to edit
                    </Typography>
                  )}
                  {!canEdit && (<Typography variant="body2" style={{ marginTop: 16 }}>
                    Display upcoming events, appointments, etc.
                  </Typography>)}
                </div>
              )}
            </CardContent>
          </DashboardSection>
        </Grid>

        <Grid size={6}>
          <DashboardSection>
            <SectionTitle><Tv size={20} /> Ads</SectionTitle>
            <CardContent>
              {/* Ads content here */}
              <Typography variant="body2">Display promotional content or advertisements.</Typography>
            </CardContent>
          </DashboardSection>
        </Grid>
        <Grid size={4}>
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

export default Home;
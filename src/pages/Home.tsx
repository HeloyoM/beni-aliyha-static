import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Footer from '../components/Footer';
import Campaign from '../components/Campaign';
import { CardContent, Typography, Grid, Paper, styled } from '@mui/material';
import { Cake, Clock, Tv, Calendar, List, CheckCircle } from 'lucide-react'; // Import icons
import { HDate, HebrewCalendar, CalOptions, Location, ParshaEvent } from '@hebcal/core';
import AppUserContext from '../context/AppUserContext';

// const options: CalOptions = {
//   year: 1981,
//   isHebrewYear: false,
//   candlelighting: true,
//   location: Location.lookup('San Francisco'),
//   sedrot: true,
//   omer: true,
// };
// const events1 = HebrewCalendar.calendar(options);

// for (const ev of events1) {
//   console.log({ ev })
//   const hd = ev.getDate();
//   const date = hd.greg();
//   console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
// }

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
  date: Date
  hebrewDate: string
  event: string
  emoji?: string | null
}

const Home: React.FC = () => {
  const [sedarot, setSedarot] = useState<ParashaType[]>([]);
  const [candlelighting, setCandlelighting] = useState<ParashaType[]>([])
  const [selectedParasha, setSelectedParasha] = React.useState();

  const { user } = useContext(AppUserContext);

  const candles = events
    .filter(ev => ev.getCategories().includes('candles'))
    .filter(ev => ev.getDate().greg() >= today)
    .map(ev => {
      const hdate = ev.getDate();
      return {
        date: hdate.greg(),
        hebrewDate: hdate.renderGematriya(),
        event: ev.render('he'),
        emoji: ev.getEmoji()
      }
    });

  const parashot: ParashaType[] = events
    .filter(ev => ev.getCategories().includes('parashat'))
    .filter(ev => ev.getDate().greg() >= today)
    .map(ev => {
      const hdate = ev.getDate();
      return {
        date: hdate.greg(),
        hebrewDate: hdate.renderGematriya(),
        event: ev.render('he'),
        emoji: ev.getEmoji()
      }
    });

  useEffect(() => {
    if (sedarot.length) return

    if (parashot) {
      setSedarot(parashot)
    }

    if (candlelighting.length) return

    if (candles) {
      setCandlelighting(candles)
    }
  }, [parashot, candles])

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

        <Grid size={6}>

          <DashboardSection style={{ backgroundColor: '#e0f7fa' }}>
            
            {candlelighting.length && <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>Candle Lighting: 
              <Typography fontWeight="bold">{candlelighting[0].event}</Typography>
              {candlelighting[0].emoji}</Typography>}

            {user && user.level === 100 && <FormControl>
              <InputLabel id="example-select-label">Select Dashboard Example</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                // value={selectedParasha}
                onChange={(e) => setSelectedParasha(selectedParasha)}>

                {sedarot.map((option) => (
                  <MenuItem value={option.event}>
                    {option.event}
                  </MenuItem>
                ))}

              </Select>
            </FormControl>}

            <SectionTitle fontWeight="bold"><Calendar size={20} />זמני התפילות</SectionTitle>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {/* Time scheduling content here */}
              <Typography variant="body2">Mincha: [Time]</Typography>
              <Typography variant="body2">Plag: [Time]</Typography>
              <Typography variant="body2">Candle Lighting: [Time]</Typography>
              <Typography variant="body2">Shacharis: [Time]</Typography>
              <Typography variant="body2">Maariv: [Time]</Typography>
              <Typography variant="body2" style={{ marginTop: 16 }}>
                Display upcoming events, appointments, etc.
              </Typography>
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
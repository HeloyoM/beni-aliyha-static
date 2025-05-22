import { HDate, HebrewCalendar, Location } from "@hebcal/core";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface ParashaType {
    date: string | undefined
    hebrewDate: string
    event: string
    emoji?: string | null
}

const today = new Date();
const now = new HDate();
const year = now.getFullYear();

const CandlelightingTimes = () => {
    const [candlelighting, setCandlelighting] = useState<ParashaType[]>([]);

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

    }, [today]);

    if (!candlelighting.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
                <CircularProgress size={50} thickness={4} />
            </Box>
        );
    }
    return (
        <Typography align="center" sx={{ mt: 2 }}>
            <strong>Candle Lighting:</strong>{' '}
            <span>{candlelighting[0].event}</span> {candlelighting[0].emoji}
        </Typography>
    )
}

export default CandlelightingTimes;
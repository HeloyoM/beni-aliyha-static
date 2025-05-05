import { HDate, HebrewCalendar, Location } from "@hebcal/core";
import { CircularProgress, Typography } from "@mui/material";
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress size={60} />
            </div>
        );
    }
    return (
        <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            Candle Lighting:
            <Typography fontWeight="bold"> {candlelighting[0].event}</Typography>
            {candlelighting[0].emoji}
        </Typography>
    )
}

export default CandlelightingTimes;
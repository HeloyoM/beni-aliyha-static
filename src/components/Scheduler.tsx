import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AppUserContext from "../context/AppUserContext";
import { getSchedules, insertSchedule } from "../api/schedule";
import { HDate, HebrewCalendar, Location } from "@hebcal/core";

interface ScheduleEntry {
    id: number;
    greg_date: string;
    hebrew_date: string;
    mincha_time: string | null;
    shacharis_time: string | null;
    maariv_time: string | null;
}

interface ParashaType {
    date: string | undefined
    hebrewDate: string
    event: string
    emoji?: string | null
}

const now = new HDate();
const year = now.getFullYear();
const today = new Date();

const Scheduler = () => {
    const [sedarot, setSedarot] = useState<ParashaType[]>([]);
    const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
    const [editingItem, setEditingItem] = useState<ScheduleEntry | null>(null);
    const [editedData, setEditedData] = useState<Partial<ScheduleEntry>>({});
    const [selectedParasha, setSelectedParasha] = useState<ParashaType>();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const { user } = useContext(AppUserContext);

    useEffect(() => {
        const events = HebrewCalendar.calendar({
            year: year,
            isHebrewYear: true,
            il: true,
            sedrot: true,
            candlelighting: true,
            location: Location.lookup('Jerusalem')
        });

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

        fetchScheduleData();
    }, [today]);

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

    const handleCloseEdit = () => {
        setIsEditDialogOpen(false);
    };


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

    const selectedSchedule = selectedParasha ? getScheduleForDate(selectedParasha.date || sedarot[0].date!) : null;

    const canEdit = user && (user.level === 100 || user.level === 101);

    return (
        <>
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
        </>
    )
}

export default Scheduler;
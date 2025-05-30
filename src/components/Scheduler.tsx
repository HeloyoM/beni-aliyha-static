import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack, styled, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppUser } from '../context/AppUser.context';
import { getSchedules, insertSchedule } from "../api/schedule";
import { HDate, HebrewCalendar, Location } from "@hebcal/core";
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { t } = useTranslation();

    const { user, canEditSchedules } = useAppUser();

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

        setError(null);

        try {
            const response = await insertSchedule(payload)

            const data = response.data as any;

            if (response.status > 200) {
                setSuccess(true);
                setScheduleData(scheduleData.map(item =>
                    item.id === editingItem?.id ? { ...item, ...editedData, hebrew_date: hebrewDateString } : item
                ));

                handleCloseEdit();
            } else {
                setError(data.message || 'Failed to create scheduling');
            }

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

    const timesSet = selectedSchedule?.shacharis_time && selectedSchedule?.mincha_time && selectedSchedule?.maariv_time;

    return (
        <>

            {sedarot.length && (
                <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    Parashat:
                    <Typography fontWeight="bold"> {sedarot[0].event}</Typography>
                </Typography>
            )}

            {user && canEditSchedules && selectedParasha && (
                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
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

            <SectionTitle>
                <CalendarIcon size={20} />
                זמני התפילות
            </SectionTitle>

            {selectedSchedule && timesSet ? (
                <Box>
                    <Stack spacing={2}>

                        {['shacharis_time', 'mincha_time', 'maariv_time'].map((key) => (
                            <><Typography>{t(`scheduler.${key}`)}</Typography>
                                <TextField
                                    key={key}
                                    name={key}
                                    type="time"
                                    size="small"
                                    value={(canEditSchedules ? editedData?.[key as keyof ScheduleEntry] : selectedSchedule?.[key as keyof ScheduleEntry]) || ''}
                                    onChange={canEditSchedules ? handleInputChange : undefined}
                                    InputProps={{
                                        readOnly: !canEditSchedules,
                                    }}
                                />
                            </>
                        ))}

                    </Stack>

                </Box>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                    {t('scheduler.no_times_set') || "Times haven't been set yet. Please check back later or edit if you have permission."}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {t('scheduler.success')}
                </Alert>
            )}

            {canEditSchedules && (
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleEdit(selectedSchedule!)}>
                    {t('scheduler.button.edit')}
                </Button>
            )}

            <Dialog open={isEditDialogOpen} onClose={handleCloseEdit}>
                <DialogTitle>{t('scheduler.dialog.title')}</DialogTitle>
                <DialogContent sx={{ paddingTop: '20px !important' }}>
                    <Grid container spacing={2}>
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>{t('scheduler.dialog.cancel')}</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">
                        {t('scheduler.dialog.save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Scheduler;
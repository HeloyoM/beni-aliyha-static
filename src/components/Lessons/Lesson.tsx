import { CalOptions, HDate, HebrewDateEvent, Location } from '@hebcal/core';
import { Alert, Button, Grid, Paper, styled, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import useLessons from './useLessons'
import dayjs, { Dayjs } from 'dayjs';
import ILesson from '../../interfaces/ILesson.interface';
import { createLesson } from '../../api/lesson';
import { useAppUser } from '../../context/AppUser.context';
import { PlusCircle } from 'lucide-react';
import React from 'react';

function initLessonState() {
    return {
        greg_date: '',
        start_time: '',
        end_time: '',
        topic: '',
        description: '',
        teacher: '',
    }
}

type Props = {
    lessons: ILesson[]
    setLessons: React.Dispatch<React.SetStateAction<ILesson[]>>
}
const Lesson = ({ lessons, setLessons }: Props) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [newLesson, setNewLesson] = useState<Partial<ILesson>>(initLessonState());

    const { setIsInsertingLesson, isInsertingLesson } = useLessons();
    const { canEditLessons } = useAppUser();

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        setNewLesson({ ...newLesson, greg_date: date ? date : '' });
    };

    const handleNewLessonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
    };

    const handleInsertLesson = async () => {
        if (
            !newLesson.greg_date ||
            !newLesson.start_time ||
            !newLesson.end_time ||
            !newLesson.topic
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const gerg_date = new Date(newLesson.greg_date)
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

        newLesson.greg_date = gerg_date.toLocaleDateString('en-GB');
        newLesson.hebrew_date = ev.render('he');

        setLoading(true);
        setError(null);

        try {
            const response = await createLesson(newLesson);

            const data = response.data as any;

            if (response.status > 200) {
                newLesson.id = data.insertId
                console.log({ newLesson })
                setLessons([newLesson as ILesson, ...lessons]);

                setNewLesson(initLessonState());

                setSuccess(true);
                setSelectedDate(null);
            } else {
                setError(data.message || 'Failed to create lesson');
            }

        } catch (error: any) {
            // Handle network errors or other exceptions
            setError(error.message || 'Failed to connect to the server');
        } finally {
            setLoading(false);
        }

    };

    if (!canEditLessons) return <></>

    return (

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


                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <MyDatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="Start Time (HH:MM)"
                                name="start_time"
                                value={newLesson.start_time || ''}
                                onChange={handleNewLessonInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="End Time (HH:MM)"
                                name="end_time"
                                value={newLesson.end_time || ''}
                                onChange={handleNewLessonInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Topic"
                                name="topic"
                                value={newLesson.topic || ''}
                                onChange={handleNewLessonInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={newLesson.description || ''}
                                onChange={handleNewLessonInputChange}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="by"
                                name="teacher"
                                value={newLesson.teacher || ''}
                                onChange={handleNewLessonInputChange}
                            />
                        </Grid>
                    </Grid>

                    {
                        error && (
                            <Alert severity="error" style={{ marginBottom: 10 }}>
                                {error}
                            </Alert>
                        )
                    }

                    {
                        success && (
                            <Alert severity="success" style={{ marginBottom: 10 }}>
                                Lesson created successfully!
                            </Alert>
                        )
                    }

                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={handleInsertLesson}
                        style={{ marginTop: '15px' }}
                    >
                        {loading ? 'Creating...' : 'Create Lesson'}
                    </Button>

                </Paper>
            )}
        </>
    )
}

export default Lesson;

const StyledDayPicker = styled(DayPicker)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // border: `1.4px solid ${theme.palette.divider}`, // Use theme's divider
    borderRadius: '8px',
    padding: theme.spacing(2),
    // boxShadow: theme.shadows[2],
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

type DateProps = {
    onChange: (day: any) => void
    selected: any
}
function MyDatePicker({ onChange, selected }: DateProps) {

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
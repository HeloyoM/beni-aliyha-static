import { Button, Select, Typography, Box, Avatar, TextField, FormControl, MenuItem, InputLabel, Alert, ListItemIcon, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppUser } from '../../context/AppUser.context';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import { CalOptions, HDate, HebrewDateEvent, Location } from '@hebcal/core';
import { createNewEvent, getEventsTypes } from '../../api/events';
import { eventIcons } from './eventIcons';
import { Star } from 'lucide-react';
import { getAllUsers } from '../../api/user';
import IUser from '../../interfaces/User.interface';
import { useTranslation } from 'react-i18next';

type EventType = {
    id: number;
    name: string;
    icon: string;
    color: string;
};


const EventForm = () => {
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);

    const { t } = useTranslation();

    const { canPublishMessages } = useAppUser();

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

    const fetchEventsTypes = async () => {
        try {
            const res = await getEventsTypes();

            const types = res.data as any;

            setEventTypes(types);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        if (canPublishMessages) {
            setLoading(true);
            setError(null);

            fetchUsers();
            fetchEventsTypes();
        }
    }, [canPublishMessages]);

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
            console.error(t('events.publish_error'));
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
    console.log({ eventTypes })
    return (
        canPublishMessages ? (

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

                <FormControl sx={{ mb: 2 }}>
                    <form onSubmit={formik.handleSubmit}>

                        <InputLabel id="type-label" style={{ color: formik.touched.type && formik.errors.type ? '#d32f2f' : '#000' }}>
                            {t('events.select_type')}
                        </InputLabel>

                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            fullWidth
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            sx={{ m: '3%', borderColor: formik.touched.type && formik.errors.type ? '#d32f2f' : '#81c784' }}
                        >
                            {eventTypes.map((et) => (
                                <MenuItem key={et.id} value={et.id}>
                                    <ListItemIcon>
                                        <Avatar
                                            src={et.icon}
                                            sx={{ width: 24, height: 24, bgcolor: et.color }}
                                            alt={et.name}
                                        >
                                            {eventIcons[et.icon] || <Star />}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={t(`events.${et.name}`)} />
                                </MenuItem>
                            ))}
                        </Select>


                        <TextField
                            label={t('events.description_label')}
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
                            sx={{ width: 'auto', height: 55 }}
                            type="date"
                            name="greg_date"
                            value={formik.values.greg_date}
                            onChange={formik.handleChange}
                        />

                        <Select
                            labelId="member-label"
                            id="member"
                            name="user_id"
                            fullWidth
                            value={formik.values.user_id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            sx={{ mt: '3%', borderColor: formik.touched.type && formik.errors.type ? '#d32f2f' : '#81c784' }}
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
                                {t('events.published')}
                            </Alert>
                        )}

                        <Button type="submit" disabled={loading} variant="contained" color="primary">
                            {t('events.submit_button')}
                        </Button>

                    </form>
                </FormControl>

            </motion.div>
        ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

                <Box
                    sx={{
                        mt: 4,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#fff3e0',
                        border: '1px solid #ffcc80',
                        textAlign: 'center',
                        maxWidth: 500,
                        mx: 'auto',
                    }}
                >
                    <Typography variant="h6" color="warning.main" gutterBottom>
                        {t('events.no_permission')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('events.no_permission_subtitle')}
                    </Typography>
                </Box>
            </motion.div>
        )
    )
}

export default EventForm;
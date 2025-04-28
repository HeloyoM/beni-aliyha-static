import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Alert, Paper, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import { DayPicker } from "react-day-picker";
import { styled } from '@mui/material/styles';
import 'react-day-picker/dist/style.css';
import { createCampaign, getCampaignTypes } from '../api/campaign';
import { useNavigate } from 'react-router-dom';

// Validation schema using yup
const newCampaignSchema = yup.object({
    name: yup.string().required('Campaign Name is required'),
    type: yup.string().required('Campaign Type is required'),
    dueDate: yup.date().required('Due Date is required').min(new Date(), 'Due Date cannot be in the past'),
    description: yup.string().required('Description is required'),
});

// Campaign types
const campaignTypes = [
    { id: 'call', name: 'Call' },
];

interface campaignTypes {
    id: string
    name: string
}
const Campaign = () => {
    const [campaignTypes, setCampaignTypes] = useState<campaignTypes[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false); // Add state for success message
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTypes = async () => {
            if (!token) {
                navigate('/'); // Redirect to login if no token
                return;
            }
            if (!campaignTypes.length) {
                setLoading(true);
                setError(null);
                try {
                    const response = await getCampaignTypes()

                    const data = response.data as any

                    setCampaignTypes(data.types)

                } catch (error: any) {
                    setError(error.response?.data?.message || 'Failed to fetch campaign types');
                } finally {
                    setLoading(false);
                }

            }

        }
        fetchTypes()
    }, [campaignTypes])

    // Formik hook for form management
    const formik = useFormik({
        initialValues: {
            name: '',
            type: 0,
            dueDate: dayjs(), // Initialize with current date
            description: '',
        },
        validationSchema: newCampaignSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            try {
                // Simulate API call (replace with your actual API endpoint)
                const response = await createCampaign(values);

                const data = response.data as any;

                if (response.status > 200) {
                    // Handle successful campaign creation
                    console.log(data); // Log the response
                    setSuccess(true); // Set success state
                    formik.resetForm(); // Clear the form
                } else {
                    // Handle error responses from the server
                    setError(data.message || 'Failed to create campaign');
                }
            } catch (error: any) {
                // Handle network errors or other exceptions
                setError(error.message || 'Failed to connect to the server');
            } finally {
                setLoading(false);
            }
        },
    });

    console.log(formik.values)

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ marginTop: 10, minHeight: '100vh', backgroundColor: '#f0f4c3' }}>
            <Grid>
                <Paper elevation={3} style={{ display: 'grid', gridTemplateColumns: 'auto auto', flexDirection: 'row', minWidth: '100vh', padding: 20, borderRadius: 16 }}>

                    <form onSubmit={formik.handleSubmit}>

                        <Typography variant="h4" align="center" style={{ marginBottom: 20, color: '#1a5235' }}>
                            New Campaign
                        </Typography>

                        {error && (
                            <Alert severity="error" style={{ marginBottom: 10 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" style={{ marginBottom: 10 }}>
                                Campaign created successfully!
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Campaign Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            style={{ marginBottom: 15, backgroundColor: '#fff' }}
                            InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                        />


                        <FormControl
                            fullWidth
                            error={formik.touched.type && Boolean(formik.errors.type)}
                            style={{ marginBottom: 15, backgroundColor: '#fff', borderRadius: 8 }}
                        >


                            <InputLabel id="type-label" style={{ color: formik.touched.type && formik.errors.type ? '#d32f2f' : '#000' }}>
                                Campaign Type
                            </InputLabel>

                            <Select
                                labelId="type-label"
                                id="type"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ borderRadius: 8, borderColor: formik.touched.type && formik.errors.type ? '#d32f2f' : '#81c784' }}
                            >
                                {campaignTypes.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.type && formik.errors.type && (
                                <FormHelperText error style={{ color: '#d32f2f' }}>
                                    {formik.errors.type}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <MyDatePicker
                            selected={formik.values.dueDate}
                            onChange={(date: Dayjs | null) => {
                                if (date) {
                                    formik.setFieldValue('dueDate', date);
                                }
                            }} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            style={{ marginTop: 20, backgroundColor: '#4caf50', color: '#fff', borderRadius: 8 }}
                        >
                            {loading ? 'Creating...' : 'Create Campaign'}
                        </Button>
                    </form>

                    <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        rows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        style={{ marginLeft: '5%', marginBottom: 15, backgroundColor: '#fff' }}
                        InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
};


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

export default Campaign;
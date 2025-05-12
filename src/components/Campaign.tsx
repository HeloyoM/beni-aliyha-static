import { useEffect, useState } from 'react';
import { TextField, Button, Grid, Alert, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import { DayPicker } from "react-day-picker";
import { styled } from '@mui/material/styles';
import { createCampaign, getCampaignTypes } from '../api/campaign';
import 'react-day-picker/dist/style.css';

// Validation schema using yup
const newCampaignSchema = yup.object({
    name: yup.string().required('Campaign Name is required'),
    type: yup.string().required('Campaign Type is required'),
    dueDate: yup.date().required('Due Date is required').min(new Date(), 'Due Date cannot be in the past'),
    description: yup.string().required('Description is required'),
});


const FormCard = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    maxWidth: 800,
    margin: 'auto',
    marginTop: theme.spacing(4),
}));

interface campaignTypes {
    id: string
    name: string
}

const Campaign = () => {
    const [campaignTypes, setCampaignTypes] = useState<campaignTypes[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchTypes = async () => {
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
                const response = await createCampaign(values);

                const data = response.data as any;

                if (response.status > 200) {
                    setSuccess(true);
                    formik.resetForm(); // Clear the form
                } else {
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

    return (
        <>
            <form onSubmit={formik.handleSubmit}>

                <Grid container spacing={2}>
                    <Grid size={12}>
                        <MyDatePicker
                            selected={formik.values.dueDate}
                            onChange={(date: Dayjs | null) => {
                                if (date) {
                                    formik.setFieldValue('dueDate', date);
                                }
                            }} />
                    </Grid>
                    <Grid size={6}>
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

                    </Grid>
                    <Grid size={6}>
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
                    </Grid>

                    <Grid size={12}>
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
                            InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                        />
                    </Grid>
                </Grid>

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


                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    style={{ marginTop: '15px' }}
                >
                    {loading ? 'Creating...' : 'Create Campaign'}
                </Button>

            </form>
        </>
    );
};


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

export default Campaign;
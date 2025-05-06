import React, { useContext, useEffect, useState } from 'react';
import { Alert, TextField, Button, Grid, Paper, Typography, Link, Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { login, register } from '../api/auth';
import { useAppUser } from '../context/AppUser.context';
import { DayPicker } from 'react-day-picker';
import dayjs, { Dayjs } from 'dayjs';
import { format } from 'date-fns';

// Validation schema using yup
const validationSchema = yup.object({
    first_name: yup.string().required('First Name is required'),
    last_name: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
    phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    address: yup.string(),
    birthday: yup.date(),
});

// Login schema
const loginValidationSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required'),
});

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    const navigate = useNavigate();

    const { updateUserContext, updateAllowedResources } = useAppUser();

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            navigate('/home')
        } else {
            document.title = isLogin ? 'login' : 'register'
        }

    }, [isLogin])

    // Function to handle form submission (Login and Register)
    const handleSubmit = async (values: any) => {
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            // Simulate API call (replace with your actual API endpoint)
            const response = isLogin ? await login(values) : await register(values)

            const data = response.data as any;

            if (response.status >= 200 && response.status < 300) {
                // Handle successful login/registration
                console.log(data); // Log the response

                // Store token and refresh token
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);

                updateUserContext(data.user);
                updateAllowedResources(data.allowedResources);
                formik.resetForm();
                navigate('/home'); // Redirect to profile page


            } else {
                // Handle error responses from the server
                setError(data.message || 'An error occurred'); // Display server message
            }
        } catch (error: any) {
            // Handle network errors or other exceptions
            setError(error.response?.data?.message || error.message || 'Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    // Formik hook for form management
    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            birthday: null
        },
        validationSchema: isLogin ? loginValidationSchema : validationSchema,
        onSubmit: handleSubmit,
    });
    console.log(formik.values)
    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '50vh', backgroundColor: 'inherit' }}>
            <Grid /*item xs={12} sm={8} md={6} lg={4} */>
                <Paper elevation={3} style={{ padding: 20, borderRadius: 16 }}>
                    <Typography variant="h4" align="center" style={{ marginBottom: 20, color: '#1a5235' }}>
                        {isLogin ? 'Login' : 'Register'}
                    </Typography>

                    {error && (
                        <Alert severity="error" style={{ marginBottom: 10 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        {!isLogin && (
                            <>
                                <TextField
                                    fullWidth
                                    id="first_name"
                                    name="first_name"
                                    label="First Name"
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                    helperText={formik.touched.first_name && formik.errors.first_name}
                                    style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                    InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                                />
                                <TextField
                                    fullWidth
                                    id="last_name"
                                    name="last_name"
                                    label="Last Name"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                    helperText={formik.touched.last_name && formik.errors.last_name}
                                    style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                    InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                                />
                            </>
                        )}
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            style={{ marginBottom: 15, backgroundColor: '#fff' }}
                            InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            style={{ marginBottom: 15, backgroundColor: '#fff' }}
                            InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                        />
                        {!isLogin && (
                            <>
                                <TextField
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                    InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                                />
                                <TextField
                                    fullWidth
                                    id="address"
                                    name="address"
                                    label="Address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                    style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                    InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                                />
                                <label
                                    htmlFor="birthday"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Birthday
                                </label>
                                <MyDatePicker selected={selectedDate} onChange={(newValue) => {
                                    setSelectedDate(newValue);
                                    formik.setFieldValue(
                                        'birthday',
                                        newValue ? format(newValue, 'yyyy-MM-dd') : null,
                                    );
                                }} />
                            </>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            style={{ marginTop: 20, backgroundColor: '#4caf50', color: '#fff', borderRadius: 8 }}
                        >
                            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                        </Button>
                    </form>
                    <Button sx={{ display: "flex", alignItems: 'center' }} >
                        <Link
                            href="#"
                            onClick={() => {
                                console.log('clicked')
                                setIsLogin(!isLogin);
                                formik.resetForm(); // Reset form when switching
                                setError(null);
                            }}
                            variant="body2"
                            style={{ color: '#1a5235' }}
                        >
                            {isLogin ? 'Create an account' : 'Already have an account? Login'}
                        </Link>
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AuthForm;



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

type MyDatePickerProps = {
    onChange: (day: any) => void
    selected: any
}
function MyDatePicker({ selected, onChange }: MyDatePickerProps) {

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
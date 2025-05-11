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
import Paths from '../enum/Paths.enum';
import { ArrowBigLeft } from 'lucide-react';
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


type Props = {
    mode: 'login' | 'register' | null
    onClose: () => void
}
const AuthForm = ({ mode, onClose }: Props) => {
    const [isLogin, setIsLogin] = useState(mode === 'login' ? true : false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    const navigate = useNavigate();

    const { updateUserContext, updateAllowedResources } = useAppUser();

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            navigate(Paths.DASHBOARD)
        } else {
            document.title = isLogin ? 'login' : 'register'
        }

    }, [isLogin])

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setError(null);
        try {

            const response = isLogin ? await login(values) : await register(values)

            const data = response.data as any;

            if (response.status >= 200 && response.status < 300) {
                console.log(data);

                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);

                updateUserContext(data.user);
                updateAllowedResources(data.allowedResources);
                formik.resetForm();
                navigate(Paths.DASHBOARD);


            } else {
                setError(data.message || 'An error occurred');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || error.message || 'Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };


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


    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '50vh', backgroundColor: 'inherit' }}>

            <Grid size={{ xs: 10, sm: 8, md: 6, lg: 12 }}>
                <Paper elevation={3} style={{ padding: 20, borderRadius: 16 }}>

                    <Button onClick={onClose} style={{ cursor: 'pointer' }} >Back</Button>


                    <Typography variant="h4" align="center" style={{ marginBottom: 20, color: '#1a5235' }}>
                        {mode?.toUpperCase()}
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

                                <TextField
                                    label='birthday'
                                    sx={{ width: 'auto', height: 55 }}
                                    type="date"
                                    name="birthday"
                                    InputLabelProps={{ shrink: true }}
                                    value={formik.values.birthday}
                                    onChange={formik.handleChange}
                                />

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
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AuthForm;
import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Grid, Paper, Typography, Box, Divider, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { profile, updatePassword } from '../api/auth';
import { updateProfile } from '../api/user';
import { useAppUser } from '../context/AppUser.context';

// Validation schema for updating phone and address
const updateProfileSchema = yup.object({
    phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone is required'),
    address: yup.string().required('Address is required'),
});

// Validation schema for password reset
const resetPasswordSchema = yup.object({
    newPassword: yup.string().min(4, 'Password must be at least 4 characters').required('New password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Confirm password is required'),
});

const UserProfile = () => {
    const [userData, setUserData] = useState<{ email: string; phone: string; address: string; first_name: string; last_name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const navigate = useNavigate();

    const { user } = useAppUser();

    const token = localStorage.getItem('token');

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                navigate('/'); // Redirect to login if no token
                return;
            }
            setLoading(true);
            setError(null);
            try {
                if (user === null) {
                    const response = await profile()
                    const data = response.data as any
                    setUserData(data.user);
                    return
                }
                setUserData(user);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch user data');
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, token, user]);

    // Formik for updating profile (phone, address)
    const updateProfileFormik = useFormik({
        initialValues: {
            phone: userData?.phone || '',
            address: userData?.address || '',
        },
        validationSchema: updateProfileSchema,
        enableReinitialize: true, // Important:  Update form values when userData changes
        onSubmit: async (values) => {
            setUpdateLoading(true);
            setError(null);
            try {
                const response = await updateProfile(values);

                console.log(response.data);
                // Update the displayed data
                setUserData({ ...userData!, phone: values.phone, address: values.address });
                alert('Profile updated successfully!'); // Basic feedback
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to update profile');
            } finally {
                setUpdateLoading(false);
            }
        },
    });

    // Formik for resetting password
    const resetPasswordFormik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            setResetLoading(true);
            setError(null);
            try {
                const response = await updatePassword(values)

                console.log(response.data);
                setResetSuccess(true);
                resetPasswordFormik.resetForm();
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to reset password');
            } finally {
                setResetLoading(false);
            }
        },
    });

    if (loading) {
        return <div style={{ textAlign: 'center' }}>Loading user data...</div>; // Simple loader
    }

    if (error) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid>
                    <Alert severity="error">{error}</Alert>
                </Grid>
            </Grid>
        );
    }

    if (!userData) {
        return <div style={{ textAlign: 'center' }}>No user data available.</div>;
    }

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(to right, #e3f2fd, #e8f5e9)',
                padding: 20,
            }}
        >
            <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6 }}>
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 4,
                        padding: 4,
                        boxShadow: '0px 6px 20px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="h4" align="center" mb={3} color="primary">
                        User Profile
                    </Typography>

                    <Box mb={4}>
                        <Typography variant="h6" gutterBottom color="text.secondary">
                            Personal Details
                        </Typography>
                        <Typography><strong>First Name:</strong> {userData.first_name}</Typography>
                        <Typography><strong>Last Name:</strong> {userData.last_name}</Typography>
                        <Typography><strong>Email:</strong> {userData.email}</Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom color="text.secondary">
                            Update Profile
                        </Typography>
                        <form onSubmit={updateProfileFormik.handleSubmit}>
                            <TextField
                                fullWidth
                                id="phone"
                                name="phone"
                                label="Phone"
                                value={updateProfileFormik.values.phone}
                                onChange={updateProfileFormik.handleChange}
                                error={updateProfileFormik.touched.phone && Boolean(updateProfileFormik.errors.phone)}
                                helperText={updateProfileFormik.touched.phone && updateProfileFormik.errors.phone}
                                style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                            />
                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                label="Address"
                                value={updateProfileFormik.values.address}
                                onChange={updateProfileFormik.handleChange}
                                error={updateProfileFormik.touched.address && Boolean(updateProfileFormik.errors.address)}
                                helperText={updateProfileFormik.touched.address && updateProfileFormik.errors.address}
                                style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={updateLoading}
                                style={{ marginTop: 20, backgroundColor: '#4caf50', color: '#fff', borderRadius: 8 }}
                            >
                                {updateLoading ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </form>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom color="text.secondary">
                            Change Password
                        </Typography>
                        <form onSubmit={resetPasswordFormik.handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    id="newPassword"
                                    name="newPassword"
                                    label="New Password"
                                    type="password"
                                    value={resetPasswordFormik.values.newPassword}
                                    onChange={resetPasswordFormik.handleChange}
                                    error={resetPasswordFormik.touched.newPassword && Boolean(resetPasswordFormik.errors.newPassword)}
                                    helperText={resetPasswordFormik.touched.newPassword && resetPasswordFormik.errors.newPassword}
                                    style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                    InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                                />
                                <TextField
                                    fullWidth
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    type="password"
                                    value={resetPasswordFormik.values.confirmPassword}
                                    onChange={resetPasswordFormik.handleChange}
                                    error={resetPasswordFormik.touched.confirmPassword && Boolean(resetPasswordFormik.errors.confirmPassword)}
                                    helperText={resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword}
                                    style={{ marginBottom: 15, backgroundColor: '#fff' }}
                                    InputProps={{ style: { borderRadius: 8, borderColor: '#81c784' } }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={resetLoading}
                                    style={{ marginTop: 20, backgroundColor: '#4caf50', color: '#fff', borderRadius: 8 }}
                                >
                                    {resetLoading ? 'Resetting...' : 'Update Password'}
                                </Button>
                                {resetSuccess && <p style={{ color: 'green' }}>Password reset successfully!</p>}
                            </Stack>
                        </form>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default UserProfile;
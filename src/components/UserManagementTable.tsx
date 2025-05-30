import React, { useEffect, useMemo, useState } from 'react';
import {
    TableContainer,
    Paper, Switch, Button, Typography, CircularProgress, useMediaQuery,
    Box,
    TextField,
    Grid,
    CardContent,
    Alert
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { getAllUsers } from '../api/user';
import { useAppUser } from '../context/AppUser.context';
import IUser from '../interfaces/User.interface';
import { toggleActivationUser } from '../api/admin';
import { exportUsersToExcel } from '../utils/exportExcel';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
}));

const UserRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const UserCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: "16px",
    boxShadow: theme.shadows[3],
    transition: "transform 0.2s ease",
    "&:hover": {
        transform: "scale(1.01)",
    },
}));

const UserManagementTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user, canDeleteUsers, canReadUsers } = useAppUser();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changes, setChanges] = useState<string[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (users.length) return

        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const data = response.data as any;

                setUsers(data.users);
            } catch (err) {
                console.error('Failed to load users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [users]);

    const filterUsers = useMemo(() => {
        if (!search.trim()) return setFilteredUsers([])

        else {
            const list = users.filter((user) =>
                `${user.first_name} ${user.last_name} ${user.email} ${user.phone}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

            setFilteredUsers(list)
        }
    }, [search])

    const handleSaveChanges = async () => {
        setSaving(true);

        setError(null);
        setSuccess(null);

        try {
            const response = await toggleActivationUser(changes);

            if (response.status === 200) {
                setSuccess(true);
            }
            setChanges([]);
        } catch (err) {
            console.error('Error saving changes:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = (userId: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, active: !u.active } : u
            )
        );

        setChanges((prev) => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearch(e.target.value);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress size={60} />
            </div>
        );
    }


    if (users.length === 0) {
        return (
            <StyledPaper>
                <Typography variant="body1" color="text.secondary" align="center">
                    No Members found.
                </Typography>
            </StyledPaper>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 2, p: 1 }}>

            <Typography variant="h6" align="center" gutterBottom>
                Kehilla members
            </Typography>

            <TextField
                label="Search member..."
                variant="outlined"
                value={search}
                onChange={(e) => handleSearch(e)}
                fullWidth
                sx={{ marginBottom: 2 }}
            />

            <Grid container spacing={2}>
                {!!filteredUsers.length && filteredUsers.map((u) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 6 }} key={u.id}>
                        <UserCard>
                            <CardContent>
                                <Typography variant="h6">{u.first_name} {u.last_name}</Typography>
                                <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                                {canReadUsers && (
                                    <Typography variant="body2">{u.phone}</Typography>
                                )}
                                {canDeleteUsers && (
                                    <div style={{ marginTop: 10 }}>
                                        <Typography variant="body2">
                                            Active: <Switch
                                                checked={u.active}
                                                onChange={() => handleToggle(user.id)}
                                            />
                                        </Typography>
                                    </div>
                                )}
                            </CardContent>
                        </UserCard>
                    </Grid>
                ))}
            </Grid>

            {!filteredUsers.length && users.map((u) => (
                <>

                    <UserRow key={u.id}>
                        <Box>
                            <Typography variant="subtitle1">
                                {u.first_name} {u.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {u.email} | {u.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {u.address}
                            </Typography>
                            {canDeleteUsers && (
                                <Typography variant="caption" color="text.disabled">
                                    ID: {u.id}
                                </Typography>
                            )}
                        </Box>
                        {canDeleteUsers && (
                            <Switch
                                checked={!!u.active}
                                onChange={() => handleToggle(u.id)}
                                color="primary"
                            />
                        )}
                    </UserRow>
                </>
            ))}

            {canDeleteUsers && (
                <>
                    {error && (
                        <Alert severity="error" style={{ marginBottom: 10 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" style={{ marginBottom: 10 }}>
                            User updated successfully!
                        </Alert>
                    )}

                    <Box mt={3} textAlign={isMobile ? 'center' : 'right'}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveChanges}
                            disabled={saving || Object.keys(changes).length === 0}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box></>
            )}

            <Box mt={2} textAlign={isMobile ? 'center' : 'right'}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => exportUsersToExcel(users)}
                >
                    Download Excel
                </Button>
            </Box>
        </TableContainer>
    );
};

export default UserManagementTable;

/*

            <Table size={isMobile ? 'small' : 'medium'}>
            //     <TableHead>
            //         <TableRow>
            //             <TableCell><b>First Name</b></TableCell>
            //             <TableCell align="right"><b>Last Name</b></TableCell>
            //             <TableCell align="center"><b>Phone number</b></TableCell>
            //             <TableCell align="center"><b>Email</b></TableCell>
            //             <TableCell align="center"><b>Adrress</b></TableCell>
            //             <TableCell align="center"></TableCell>
            //             {/* {visibleFields(user.role_id).map((field, index) => (
            //                 <TableCell key={index}>{field.toUpperCase()}</TableCell>
                       // // ))} */
//             {user.level === 100 && <TableCell>ACTIVE</TableCell>}
//         </TableRow>
//     </TableHead>

//     <TableBody>
//         {users.map((u, i) => (
//             <TableRow key={i}>
//                 <TableCell><b>{u.first_name}</b></TableCell>
//                 <TableCell align="right"><b>{u.last_name}</b></TableCell>
//                 <TableCell align="center"><b>{u.phone}</b></TableCell>
//                 <TableCell align="center"><b>{u.email}</b></TableCell>
//                 <TableCell align="center"><b>{u.address}</b></TableCell>
//                 <TableCell align="center"></TableCell>
//                 {/* {visibleFields(user.role_id).map((field: any, index: number) => (
//                     <TableCell key={index}>{u[field]}</TableCell>
//                 ))} */}
//                 {user.level === 100 && (
//                     <TableCell>
//                         <Switch
//                             checked={u.active}
//                             onChange={() => handleToggleActive(u.id, u.active)}
//                             color="primary"
//                         />
//                     </TableCell>
//                 )}
//             </TableRow>
//         ))}
//     </TableBody>
// </Table>*/

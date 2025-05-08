import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Typography, useMediaQuery,
    CardContent,
    Card,
    Grid,
    Box,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import { format } from 'date-fns';

interface Payment {
    id: string;
    user_id: string;
    description: string;
    amount: number;
    due_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const getStatusColor = (status: Payment['status']) => {
    switch (status) {
        case 'paid': return 'success';

        case 'pending': return 'warning';

        case 'overdue': return 'error';

        default: return 'default';
    }
};

const isOverdue = (dueDate: string, status: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && status !== 'paid' && status !== 'pending';
};

type Props = {
    payments: Payment[];
};

const PaymentsTable: React.FC<Props> = ({ payments }) => {
    const [view, setView] = useState<'cards' | 'table'>('cards');
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box sx={{ px: isMobile ? 1 : 4, py: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Payments Overview</Typography>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(_, newView) => newView && setView(newView)}
                    size="small"
                >
                    <ToggleButton value="cards">Cards</ToggleButton>
                    <ToggleButton value="table">Table</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {view === 'cards' ? (
                <Grid container spacing={3}>


                    {payments.map((p) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    borderColor: p.status === 'overdue' ? 'error.main' : 'divider',
                                    backgroundColor: p.status === 'paid' ? '#e8f5e9' : undefined,
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {p.description}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={p.status.toUpperCase()}
                                            color={getStatusColor(p.status)}
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        User: {p.user.name} ({p.user.email})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Amount: <strong>${p.amount}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Due: {format(new Date(p.due_date), 'MMM dd, yyyy')}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        Created: {format(new Date(p.created_at), 'MMM dd, yyyy')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {payments.length === 0 && (
                        <Grid size={{ md: 12 }}>
                            <Typography variant="body1" align="center" color="text.secondary">
                                No payments to display.
                            </Typography>
                        </Grid>
                    )}


                </Grid>) : (

                <TableContainer component={Paper} sx={{ borderRadius: 4, p: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        Payment History
                    </Typography>
                    <Table size={isMobile ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell><b>Description</b></TableCell>
                                <TableCell align="right"><b>Amount</b></TableCell>
                                <TableCell align="center"><b>Due Date</b></TableCell>
                                <TableCell align="center"><b>Status</b></TableCell>
                                <TableCell align="center"><b>Created</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((p) => (
                                <TableRow
                                    key={p.id}
                                    sx={{
                                        backgroundColor: isOverdue(p.due_date, p.status) ? '#ffebee' : 'inherit',
                                    }}
                                >
                                    <TableCell>{p.user.name} ({p.user.email})</TableCell>
                                    <TableCell>{p.description}</TableCell>
                                    <TableCell align="right">
                                        ${p.amount}
                                    </TableCell>
                                    <TableCell align="center">
                                        {format(new Date(p.due_date), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={p.status.toUpperCase()}
                                            color={getStatusColor(p.status)}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {format(new Date(p.created_at), 'MMM dd, yyyy')}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {payments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary">No payments found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

        </Box>

    );
};

export default PaymentsTable;

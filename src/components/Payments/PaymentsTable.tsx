import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Typography, useMediaQuery,
    CardContent,
    Card,
    Grid,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    Select,
    MenuItem
} from '@mui/material';
import { format, isBefore } from 'date-fns';
import IPayment from '../../interfaces/IPayment.interface';
import { useTranslation } from 'react-i18next';

const getStatusColor = (status: IPayment['status']) => {
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
    payments: IPayment[];
};

const PaymentsTable: React.FC<Props> = ({ payments }) => {
    const [view, setView] = useState<'cards' | 'table'>('cards');
    const isMobile = useMediaQuery('(max-width:600px)');
    const [statusMap, setStatusMap] = useState<Record<string, IPayment['status']>>({});

    const { t } = useTranslation();

    const handleStatusChange = (id: string, newStatus: IPayment['status']) => {
        setStatusMap((prev) => ({ ...prev, [id]: newStatus }));
        // TODO: send to backend via fetch/axios/mutation
    };

    return (
        <Box sx={{ px: isMobile ? 1 : 4, py: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">{t('payments.table.title')}</Typography>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(_, newView) => newView && setView(newView)}
                    size="small"
                >
                    <ToggleButton value="cards">{t('payments.table.toggle.cards')}</ToggleButton>
                    <ToggleButton value="table">{t('payments.table.toggle.table')}</ToggleButton>
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
                                        {t('payments.table.headers.user')}: {p.user.name} ({p.user.email})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        {t('payments.table.headers.amount')}: <strong>₪{p.amount}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('payments.table.headers.due')}: {p.due_date}
                                        {isBefore(p.due_date, new Date()) && ' (Overdue)'}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        {t('payments.table.headers.created')}: {format(new Date(p.created_at), 'MMM dd, yyyy')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {payments.length === 0 && (
                        <Grid size={{ md: 12 }}>
                            <Typography variant="body1" align="center" color="text.secondary">
                                {t('payments.table.toggle.headers.no_payments')}
                            </Typography>
                        </Grid>
                    )}


                </Grid>) : (

                <TableContainer component={Paper} sx={{ borderRadius: 4, p: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
                        {t('payments.table.history')}
                    </Typography>
                    <Table size={isMobile ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow>
                                <TableCell> {t('payments.table.headers.user')}</TableCell>
                                <TableCell><b> {t('payments.table.headers.description')}</b></TableCell>
                                <TableCell align="right"><b> {t('payments.table.headers.amount')}</b></TableCell>
                                <TableCell align="center"><b> {t('payments.table.headers.due')}</b></TableCell>
                                <TableCell align="center"><b> {t('payments.table.headers.status')}</b></TableCell>
                                <TableCell align="center"><b> {t('payments.table.headers.created')}</b></TableCell>
                                <TableCell align="center"></TableCell>
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
                                        ₪{p.amount}
                                    </TableCell>
                                    <TableCell align="center">
                                        {p.due_date}
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
                                    <TableCell align="center">
                                        <Select
                                            size="small"
                                            value={statusMap[p.id] || p.status}
                                            onChange={(e) => handleStatusChange(p.id, e.target.value as IPayment['status'])}
                                            variant="outlined"
                                            sx={{ minWidth: 100 }}
                                        >
                                            <MenuItem value="paid">{t('payments.table.status.paid')}</MenuItem>
                                            <MenuItem value="pending">{t('payments.table.status.pending')}</MenuItem>
                                            <MenuItem value="overdue">{t('payments.table.status.overdue')}</MenuItem>
                                            <MenuItem value="cancelled">{t('payments.table.status.cancelled')}</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {payments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary">{t('payments.table.no_payments')}</Typography>
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

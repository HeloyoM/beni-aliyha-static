import {
    Box, TextField, Button, MenuItem, Select, InputLabel, FormControl,
    Typography,
    Paper,
    Alert
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import IPayment from '../../interfaces/IPayment.interface';
import { createPayment } from '../../api/payments';
import AppDatePicker from '../AppDatePicker';
import { useTranslation } from 'react-i18next';

const presetDescriptions = ['Cleaning', 'Donate', 'Maintenance', 'Other'];

type Props = {
    setPayments: React.Dispatch<React.SetStateAction<IPayment[]>>
}
export default function QuickAddPayment({ setPayments }: Props) {
    const [descChoice, setDescChoice] = useState('');
    const [customDesc, setCustomDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { t } = useTranslation();

    const handleSubmit = async () => {
        const finalDescription = descChoice === 'Other' ? customDesc.trim() : descChoice;

        if (!finalDescription || !amount || !dueDate) {
            setError(t('payments.create.missing_fields'));
            return;
        }

        setLoading(true);

        const gerg_date = new Date(dueDate)

        const payment = {
            description: finalDescription,
            amount: parseFloat(amount),
            due_date: gerg_date.toLocaleDateString('en-GB')
        };


        try {

            const response = await createPayment(payment)

            const data = response.data as any;

            if (response.status > 200) {
                console.log(data);

                setPayments(prev => [data, ...prev])
                setSuccess(true);
                // Reset
                setDescChoice('');
                setCustomDesc('');
                setAmount('');
                setDueDate(null);
                setError('');
            } else {
                setError(data.message || t('payments.create.generic'));
            }

        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to fetch campaign types');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        setDueDate(date);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>


            <Typography variant="h6" gutterBottom>
                {t('payments.create.title')}
            </Typography>


            <Box display="flex" flexWrap="wrap" gap={2}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>{t('payments.create.description')}</InputLabel>
                    <Select
                        value={descChoice}
                        label={t('payments.create.description')}
                        onChange={(e) => setDescChoice(e.target.value)}
                    >
                        {presetDescriptions.map((desc) => (
                            <MenuItem key={desc} value={desc}>{desc}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {descChoice === 'Other' && (
                    <TextField
                        label={t('payments.create.custom_description')}
                        value={customDesc}
                        onChange={(e) => setCustomDesc(e.target.value)}
                        fullWidth
                    />
                )}

                <TextField
                    label={t('payments.create.amount')}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputProps={{ min: 0 }}
                />


                <AppDatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                />
                {error && (
                    <Alert severity="error" style={{ marginBottom: 10 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" style={{ marginBottom: 10 }}>
                        {t('payments.create.success')}
                    </Alert>
                )}

            </Box>


            <Box alignSelf="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? t('payments.create.button.saving') : t('payments.create.button.save')}
                </Button>
            </Box>


            {error && (
                <Typography color="error" mt={2}>
                    {error}
                </Typography>
            )}
        </Paper>
    );
}

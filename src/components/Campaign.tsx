import { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    useMediaQuery,
    Paper
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import { createCampaign, getCampaignTypes } from '../api/campaign';
import 'react-day-picker/dist/style.css';
import AppDatePicker from './AppDatePicker';
import { useTranslation } from 'react-i18next';

// Validation schema using yup
const newCampaignSchema = yup.object({
    name: yup.string().required('Campaign Name is required'),
    type: yup.string().required('Campaign Type is required'),
    dueDate: yup.date().required('Due Date is required').min(new Date(), 'Due Date cannot be in the past'),
    description: yup.string().required('Description is required')
});

interface campaignTypes {
    id: number
    name: string
}

const Campaign = () => {
    const [campaignTypes, setCampaignTypes] = useState<campaignTypes[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isDonation, setIsDonation] = useState(false);

    const isMobile = useMediaQuery('(max-width:900px)');
    const showStyledCalendar = useMediaQuery('(max-width:1200px)');

    const { t } = useTranslation();


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
                    setError(error.response?.data?.message || t('campaign.campaign_form.failed_fetch_types'));
                } finally {
                    setLoading(false);
                }

            }
        }
        fetchTypes()
    }, [campaignTypes])

    const formik = useFormik({
        initialValues: {
            name: '',
            type: 0,
            dueDate: null,
            description: '',
            goal_amount: '',
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
                    formik.resetForm();
                } else {
                    setError(data.message || t('campaign.campaign_form.failed_create'));
                }
            } catch (error: any) {
                setError(error.message || t('campaign.campaign_form.generic'));
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const selectedType = campaignTypes.find(t => t.id === formik.values.type);
        setIsDonation(selectedType?.name.toLowerCase() === 'donate');
    }, [formik.values.type, campaignTypes])

    const handleDateChange = (date: any) => {
        formik.setFieldValue('dueDate', date);
    }

    const elem = (
        <form onSubmit={formik.handleSubmit}>

            <Grid container spacing={2}>


                <Grid size={12}>

                    {showStyledCalendar ? (<TextField
                        sx={{ width: 'auto', height: 55 }}
                        type="date"
                        name="dueDate"
                        value={formik.values.dueDate}
                        onChange={(date) => handleDateChange(date)}
                    />) : (<AppDatePicker
                        selected={formik.values.dueDate}
                        onChange={(date: Dayjs | null) => {
                            if (date) {
                                formik.setFieldValue('dueDate', date);
                            }
                        }} />)
                    }

                </Grid>


                <Grid size={12}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label={t('campaign.campaign_form.name_label')}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        sx={{ backgroundColor: '#fff' }}
                    />

                </Grid>
                <Grid size={12}>
                    <FormControl
                        fullWidth
                        error={formik.touched.type && Boolean(formik.errors.type)}
                        sx={{ marginBottom: 15, backgroundColor: '#fff', borderRadius: 8 }}
                    >

                        <InputLabel id="type-label" style={{ color: formik.touched.type && formik.errors.type ? '#d32f2f' : '#000' }}>
                            {t('campaign.campaign_form.type_label')}
                        </InputLabel>

                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            sx={{ minWidth: '12vw', borderRadius: 8, borderColor: formik.touched.type && formik.errors.type ? '#d32f2f' : '#81c784' }}
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

                        {isDonation && (
                            <TextField
                                id="goal_amount"
                                name="goal_amount"
                                label={t('campaign.campaign_form.goal_amount_label')}
                                type="number"
                                value={formik.values.goal_amount || ''}
                                onChange={formik.handleChange}
                                error={formik.touched.goal_amount && Boolean(formik.errors.goal_amount)}
                                helperText={formik.touched.goal_amount && formik.errors.goal_amount}
                            />
                        )}
                    </FormControl>
                </Grid>

                <Grid size={12}>
                    <TextField
                        id="description"
                        name="description"
                        label={t('campaign.campaign_form.description')}
                        multiline
                        fullWidth
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
                    {t('campaign.campaign_form.success')}
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
                {loading ? t('campaign.campaign_form.button.creating') : t('campaign.campaign_form.button.create_campaign')}
            </Button>

        </form>
    )

    return (
        isMobile ? elem : (
            <Paper style={{ padding: '15px', marginTop: '10px', backgroundColor: '#f9f9f9' }}>
                {elem}
            </Paper>
        )
    );
};

export default Campaign;
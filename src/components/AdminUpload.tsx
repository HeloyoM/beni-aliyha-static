import { useEffect, useState } from 'react';
import { Button, Typography, Box, Paper, Stack, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useForm } from 'react-hook-form'
import { uploadFile } from '../api/file';
import { useTranslation } from 'react-i18next';
import { InsertDriveFile } from '@mui/icons-material';
const AdminUpload = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const { watch, register } = useForm()

    const { t } = useTranslation();

    // const files = watch('file') || [];

    useEffect(() => {
        const fileList = watch('file');
        if (fileList && fileList.length > 0) {
            setFiles(Array.from(fileList));
        }
    }, [watch('file')]);

    const handleUpload = async (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        if (!files || files.length === 0) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }


        formData.append('eventTitle', 'Scp');
        try {
            await uploadFile(formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || t('special_event.upload_failed'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress size={60} />
            </div>
        );
    }

    return (
        <Box
            sx={{
                textAlign: 'center',
                my: 6,
                px: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 600,
                    mx: 'auto',
                    borderRadius: 4,
                    background: 'linear-gradient(to bottom right, #fff8e1, #ffe0b2)',
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t('special_event.upload_title') || 'Upload PDFs for the Event'}
                </Typography>

                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                        borderRadius: 3,
                        py: 1,
                        px: 3,
                        mb: 2,
                        fontWeight: 500,
                        backgroundColor: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#ffecb3',
                        },
                    }}
                >
                    {t('special_event.choose_file_s') || 'Choose PDFs'}
                    <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        hidden
                        {...register('file')}
                    />
                </Button>

                <Stack spacing={1} alignItems="center" my={2}>
                    {files.length > 0 &&
                        files.map((file: any, index: number) => (
                            <Stack
                                direction="row"
                                spacing={1}
                                key={index}
                                alignItems="center"
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    width: '100%',
                                    maxWidth: 400,
                                }}
                            >
                                <InsertDriveFile color="action" />
                                <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{ maxWidth: '90%' }}
                                    title={file.name}
                                >
                                    {file.name}
                                </Typography>
                            </Stack>
                        ))}
                </Stack>

                {error && (
                    <Alert severity="error" style={{ marginBottom: 10 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" style={{ marginBottom: 10 }}>
                        {t('special_event.success')}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    onClick={(e) =>handleUpload(e)}
                    disabled={files.length === 0}
                    sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #FFA726, #FB8C00)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: '0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #EF6C00, #F57C00)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        },
                    }}
                >
                    {t('special_event.upload')}
                </Button>

            </Paper>
        </Box>
    );
};

export default AdminUpload;

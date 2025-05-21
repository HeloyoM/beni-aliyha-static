import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@mui/material';
import ILesson from '../../interfaces/ILesson.interface';
import useLessons from './useLessons';
import { useTranslation } from 'react-i18next';

type Props = {
    lessons: ILesson[]
}
const LessonsList = ({ lessons }: Props) => {
    const { isInsertingLesson } = useLessons();

    const { t } = useTranslation();

    // Helper function to calculate duration
    const getDuration = (startTime: string, endTime: string) => {
        if (!startTime || !endTime) return 'N/A';
        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);
        const diff = end.getTime() - start.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const getNextLesson = (lessons: ILesson[]) => {
        const now = new Date();
        const upcomingLessons = lessons.filter(lesson => new Date(lesson.greg_date) >= now);
        if (upcomingLessons.length > 0) {
            upcomingLessons.sort((a, b) => new Date(a.greg_date).getTime() - new Date(b.greg_date).getTime());
            return upcomingLessons[0];
        }
        return null;
    };

    const nextLesson = getNextLesson(lessons);

    return (
        <>
            {lessons.length > 0 ? (
                lessons.map((lesson) => {

                    const isNextLesson = nextLesson?.id === lesson.id;

                    return (
                        <motion.div
                            key={lesson.id}
                            style={{
                                borderRadius: '8px',
                                padding: '15px',
                                backgroundColor: isNextLesson ? 'rgb(52, 171, 83)' : '#f5f5f5',
                                color: isNextLesson ? '#fff' : '#ff6f00',
                                border: '1px solid #ddd',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s ease, transform 0.2s ease',
                                fontWeight: isNextLesson ? 'bold' : 'normal', // Bold the next lesson
                            }}
                            whileHover={{ backgroundColor: isNextLesson ? '#93CCEA' : 'none' }}
                        >
                            <AnimatePresence>
                                {isInsertingLesson && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <Typography variant="h6" style={{ color: isNextLesson ? '#fff' : '#ff6f00', marginBottom: '10px' }}>{t('lesson.lesson_title')}</Typography>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Typography
                                variant="body1"
                                style={{
                                    fontWeight: isNextLesson ? 'bold' : 'normal',
                                    color: isNextLesson ? '#fff' : '#2c3e50',
                                }}
                            >
                                {lesson.topic}
                            </Typography>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <Typography variant="body2" style={{ color: isNextLesson ? '#fff' : '#7f8c8d' }}>
                                    {t('lesson.date')}: {lesson.greg_date}
                                </Typography>
                                <Typography variant="body2" style={{ color: isNextLesson ? '#fff' : '#7f8c8d' }}>
                                    {t('lesson.time')}: {lesson.start_time} - {lesson.end_time}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{
                                        fontWeight: isNextLesson ? 'bold' : 'normal',
                                        color: isNextLesson ? '#fff' : '#34495e',
                                    }}
                                >
                                    ({getDuration(lesson.start_time, lesson.end_time)})
                                </Typography>
                            </div>
                            {lesson.description && (
                                <Typography variant="body2" style={{ fontStyle: 'italic', color: isNextLesson ? '#fff' : '#95a5a6' }}>
                                    {lesson.description}
                                </Typography>
                            )}
                            {lesson.teacher && (
                                <Typography
                                    variant="body2"
                                    style={{
                                        fontWeight: isNextLesson ? 'bold' : 'normal',
                                        color: isNextLesson ? '#fff' : '#2c3e50',
                                    }}
                                >
                                    {t('lesson.by_teacher', { teacher: lesson.teacher })}
                                </Typography>
                            )}
                        </motion.div>
                    );
                })
            ) : (
                <Typography variant="body2">No lessons scheduled.</Typography>
            )}</>
    )
}

export default LessonsList;
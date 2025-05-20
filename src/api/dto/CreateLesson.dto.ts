export interface CreateLessonDto {
    greg_date: string;
    start_time: string;
    hebrew_date: string
    end_time: string;
    topic: string;
    description?: string;
    teacher?: string;
}
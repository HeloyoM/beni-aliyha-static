import { useEffect, useState } from "react";
import ILesson from "../../interfaces/ILesson.interface";
import { getLessons } from "../../api/lesson";
import { isTokenExpired } from "../../utils/isTokenExpired";

const useLessons = () => {
    const [lessons, setLessons] = useState<ILesson[]>([]);
    const [isInsertingLesson, setIsInsertingLesson] = useState(false);

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (lessons.length) return

        if (token && isTokenExpired(token)) {

            const fetchLessonsData = async () => {
                try {
                    const response = await getLessons();
                    const data = response.data as any;
                    setLessons(data);
                } catch (error: any) {
                    console.error("Error fetching lessons:", error);
                    setLessons([]);
                }
            };
            fetchLessonsData();

        }

    }, [lessons]);

    return { lessons, setLessons, isInsertingLesson, setIsInsertingLesson }
}

export default useLessons;
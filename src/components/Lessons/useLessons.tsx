import { useEffect, useState } from "react";
import ILesson from "../../interfaces/ILesson.interface";
import { getLessons } from "../../api/lesson";
import { isTokenExpired } from "../../utils/isTokenExpired";
import { useNavigate } from "react-router-dom";
import Paths from "../../enum/Paths.enum";

const useLessons = () => {
    const [lessons, setLessons] = useState<ILesson[]>([]);
    const [isInsertingLesson, setIsInsertingLesson] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    useEffect(() => {
        console.log(token, isTokenExpired(token))

        if (token && isTokenExpired(token)) {
            navigate(Paths.ON_BOARDING);
            return;
        }

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
    }, [navigate]);

    return { lessons, setLessons, isInsertingLesson, setIsInsertingLesson }
}

export default useLessons;
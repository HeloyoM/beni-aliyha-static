import { Card, CardContent, Typography } from "@mui/material";
import { Cake } from "lucide-react";
import { useEffect, useState } from "react";
import IUser from "../interfaces/User.interface";
import { getAllUsers } from "../api/user";
import dayjs from "dayjs";
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";

const Birthdays = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [todayBirthdays, setTodayBirthdays] = useState<IUser[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        if (!!users.length) return

        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();

                const data = response.data as any;
                if (response.status !== 200) {
                    throw new Error(data.message || 'Failed to fetch users');
                }

                setUsers(data.users);

            } catch (error: any) {
                console.log({ error })
            }
        };
        fetchUsers();
    }, [users]);


    useEffect(() => {
        const today = dayjs()

        const todayBirthdays = users.filter(user => {
            if (!user.birthday) return false;

            const userBirthday = dayjs(user.birthday);
            const dd = userBirthday.get('D')
            const mm = userBirthday.get('M')

            if (today.get('D') === dd && today.get('M') === mm) return true
            else return false
        });
        setTodayBirthdays(todayBirthdays);
    }, [users]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                    <Cake style={{ marginRight: 5, height: 20, width: 20 }} /> {t('birthdays.title')}
                </Typography>
                {todayBirthdays.length > 0 ? (
                    <ul>
                        {todayBirthdays.map(user => (
                            <li key={user.id}>
                                {user.first_name} {user.last_name} ({format(new Date(user.birthday!), 'PPP')})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography variant="body2">{t('birthdays.no_birthdays')}</Typography>
                )}
            </CardContent>
        </Card>
    )
}

export default Birthdays;
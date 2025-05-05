import React from 'react';
import { Alert, AlertTitle, Button, Typography } from '@mui/material';
import { useAppUser } from '../context/AppUser.context'; // Import the useAuth hook
import { AlertCircle } from "lucide-react"

const TestPermission = () => {
    const { user, allowedResources } = useAppUser();

    let canEditLessons
    let canReadSchedules
    let canEditSchedules
    let canDeleteUsers

    allowedResources?.map((row, i) => {
        const resource = row.split(':')

        if (resource.includes('lessons')) {
            console.log({ row })
            if (resource.includes('write')) {
                console.log('canEditLEssons')
                canEditLessons = true
            }
        } else if (resource.includes('schedules')) {
            if (resource.includes('write')) {
                console.log('canEditSchedules')
                canEditSchedules = true
            } else {
                canReadSchedules = true
            }
        } else if (resource.includes('users')) {
            if (resource.includes('delete')) {
                console.log('canDeleteUsers')
                canDeleteUsers = true
            }
        }
    })


    return (
        <div>
            <p>Welcome, {user?.first_name + ' ' + user?.last_name}!</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>

            {canEditLessons ? (
                <Button variant="contained">Edit Lesson</Button>
            ) : (
                <Alert variant="outlined">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Read Only</AlertTitle>
                    <Typography>
                        You do not have permission to edit lessons.
                    </Typography>
                </Alert>
            )}

            {canReadSchedules && <p>Display Schedule</p>}

            {canDeleteUsers && <Button variant="outlined">Delete User</Button>}
        </div>
    );
};

export default TestPermission;


import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import IUser from '../interfaces/User.interface';

interface AppUserContextProps {
    user: IUser;
    updateUserContext: (user: IUser) => void;
    logout: () => void;
    allowedResources: string[] | null;
    updateAllowedResources: (resources: string[]) => void;
    canEditLessons: boolean;
    canEditSchedules: boolean;
    canEditPayments: boolean;
    canPublishMessages: boolean;
    canDeleteUsers: boolean;
    canReadUsers: boolean;
}

const AppUserContext = createContext<AppUserContextProps | undefined>(undefined);

const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser>({} as IUser);
    const [canEditLessons, setCanEditLesson] = useState<boolean>(false);
    const [canEditSchedules, setCanEditSchedules] = useState<boolean>(false);
    const [canEditPayments, setEditPayments] = useState<boolean>(false);
    const [canPublishMessages, setPublishMessages] = useState<boolean>(false);
    const [canDeleteUsers, setCanDeleteUsers] = useState<boolean>(false);
    const [canReadUsers, setCanReadUsers] = useState<boolean>(false);

    const [allowedResources, setAllowedResources] = useState<string[] | null>(null);

    const getPermissions = useMemo(() => {

        allowedResources?.map((row, i) => {

            const [resName, resScope] = row.split(':')

            if (resName === 'lessons') {
                if (resScope === 'write') {
                    setCanEditLesson(true)
                }
            }

            else if (resName === 'schedules') {
                if (resScope === 'write') {
                    setCanEditSchedules(true)
                }
            }

            else if (resName === 'payments') {
                if (resScope === 'write') {
                    setEditPayments(true)
                }
            }

            else if (resName === 'messages') {
                if (resScope === 'write') {
                    setPublishMessages(true)
                }
            }

            else if (resName === 'users') {
                if (resScope === 'delete') {
                    setCanDeleteUsers(true)
                } else if (resScope === 'read') {
                    setCanReadUsers(true)
                }
            }

        })
    }, [allowedResources])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [allowedResources]);

    const updateUserContext = (userData: IUser) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateAllowedResources = (resources: string[]) => {
        setAllowedResources(resources);
    };

    const logout = () => {
        setUser({} as IUser);
        setAllowedResources(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('hideGuestDescription');
        localStorage.removeItem('privacyAccepted');
        setEditPayments(false);
        setCanEditLesson(false);
        setCanEditSchedules(false);
        setCanDeleteUsers(false);
        setCanReadUsers(false);
        setPublishMessages(false);
    };

    const contextValue = {
        user,
        updateUserContext,
        logout,
        allowedResources,
        canEditLessons,
        canEditSchedules,
        updateAllowedResources,
        canEditPayments,
        canPublishMessages,
        canReadUsers,
        canDeleteUsers
    };

    return (
        <AppUserContext.Provider value={contextValue}>
            {children}
        </AppUserContext.Provider>
    );
};

const useAppUser = () => {
    const context = useContext(AppUserContext);
    if (!context) {
        throw new Error('useAppUser must be used within an AppUserProvider');
    }
    return context;
};

export { AppUserProvider, useAppUser };

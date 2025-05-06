import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import IUser from '../interfaces/User.interface';



interface AppUserContextProps {
    user: IUser;
    updateUserContext: (user: IUser) => void;
    logout: () => void;
    allowedResources: string[] | null;
    updateAllowedResources: (resources: string[]) => void;
    canEditLessons: boolean
    canEditUsers: boolean
    canEditSchedules: boolean
}

const AppUserContext = createContext<AppUserContextProps | undefined>(undefined);

const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser>({} as IUser);
    const [canEditLessons, setCanEditLesson] = useState<boolean>(false);
    const [canEditSchedules, setCanEditSchedules] = useState<boolean>(false);
    const [canEditUsers, setEditUsers] = useState<boolean>(false);
    const [allowedResources, setAllowedResources] = useState<string[] | null>(null);

    const getPermissions = useMemo(() => {
        allowedResources?.map((row, i) => {
            const resource = row.split(':')
            if (resource.includes('lessons')) {
                if (resource.includes('write')) {
                    setCanEditLesson(true)
                }
            } else if (resource.includes('schedules')) {
                if (resource.includes('write')) {
                    setCanEditSchedules(true)
                }
            } else if (resource.includes('users')) {
                if (resource.includes('delete')) {
                    setEditUsers(true)
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

    };

    const contextValue = {
        user,
        updateUserContext,
        logout,
        allowedResources,
        canEditLessons,
        canEditSchedules,
        canEditUsers,
        updateAllowedResources,
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

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the User interface
interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role_id: number;
    level: number;
    address: string;
}

interface AppUserContextProps {
    user: User;
    updateUserContext: (user: User) => void;
    logout: () => void;
    allowedResources: string[] | null;  // Add allowedResources
    updateAllowedResources: (resources: string[]) => void; // Add setter
}

const AppUserContext = createContext<AppUserContextProps | undefined>(undefined);

const AppUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({} as User);
    const [allowedResources, setAllowedResources] = useState<string[] | null>(null);  // Initialize state
    // const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedResources = localStorage.getItem('allowedResources');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedResources) {
            setAllowedResources(JSON.parse(storedResources));
        }
    }, []);

    const updateUserContext = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateAllowedResources = (resources: string[]) => { // Setter
        setAllowedResources(resources);
        localStorage.setItem('allowedResources', JSON.stringify(resources));
    };

    const logout = () => {
        setUser({} as User);
        setAllowedResources(null); //clear
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('allowedResources'); // Remove allowedResources
        // navigate('/auth');
    };

    const contextValue = {
        user,
        updateUserContext,
        logout,
        allowedResources,
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

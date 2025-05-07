import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import Home from './pages/Home';
import Header from './components/Header';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import ScreenWrapper from './components/ScreenWrapper';
import { AppUserProvider, useAppUser } from './context/AppUser.context';
import AppServerMsgContext from "./context/AppServerMsg";
import './App.css';
import UserProfile from './components/UserProfile';
import WelcomeScreen from './components/WelcomScreen';
import CampaignList from './components/CampaignList';
import Messages from './components/Messages';
import { profile } from './api/auth';
import GuestPage from './components/GuestPage';
import IUser from './interfaces/User.interface';
import FloatingActions from './components/FloatingActions';

// Helper function to check token expiration
const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    console.log({ decoded })
    if (!decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

const App: React.FC = () => {
  const [serverMsg, setServerMsg] = React.useState('');

  const updateServerMsgContext = (msg: any) => { setServerMsg(msg) }

  return (
    <AppServerMsgContext.Provider value={{ updateServerMsgContext, serverMsg }}>
      <AppUserProvider>
        <Router>
          <AppContent />
        </Router>
      </AppUserProvider>
    </AppServerMsgContext.Provider>
  )
}

export default App;

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { updateUserContext, logout, updateAllowedResources } = useAppUser();
  
  // Determine whether to show the Header and ScreenWrapper
  const shouldShowWrapper = location.pathname !== '/' && location.pathname !== '/guest';

  const token = localStorage.getItem('token');

  // Function to handle logout
  const handleLogout = useCallback(() => {
    logout()
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (token && !isTokenExpired(token)) {

      try {
        const fetchUserProfile = async () => {
          const response = await profile();

          const data = response.data as any;

          updateUserContext(data.user)
          updateAllowedResources(data.allowedResources)
        }

        fetchUserProfile();

      } catch (error) {
        console.error("Error decoding token on initial load:", error);
        handleLogout();
        return;
      }
    } else {
      // handleLogout();
    }

  }, [handleLogout]);

  return (
    <>
      {shouldShowWrapper && (
          <FloatingActions />
      )}

      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/campaings" element={<CampaignList />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export const NotFound: React.FC = () => {
  return (
    <Typography variant="h3" align="center" gutterBottom>
      Not found
    </Typography>
  )
}
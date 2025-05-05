import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import Home from './pages/Home';
import Header from './components/Header';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import ScreenWrapper from './components/ScreenWrapper';
import AppUserContext from './context/AppUserContext';
import AppServerMsgContext from "./context/AppServerMsg";
import './App.css';
import UserProfile from './components/UserProfile';
import WelcomeScreen from './components/WelcomScreen';
import CampaignList from './components/CampaignList';
import Messages from './components/Messages';
import { profile } from './api/auth';
import GuestPage from './components/GuestPage';

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
  const [crrUser, setUser] = React.useState<any>(null);
  const [serverMsg, setServerMsg] = React.useState('');

  const updateUserContext = (user: any) => { setUser(user) }
  const updateServerMsgContext = (msg: any) => { setServerMsg(msg) }

  return (
    <AppServerMsgContext.Provider value={{ updateServerMsgContext, serverMsg }}>
      <AppUserContext.Provider value={{ updateUserContext, user: crrUser }}>
        <Router>
          <AppContent setUser={setUser} />
        </Router>
      </AppUserContext.Provider>
    </AppServerMsgContext.Provider>
  )
}

export default App;

type Props = {
  setUser: React.Dispatch<any>
}
const AppContent = ({ setUser }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine whether to show the Header and ScreenWrapper
  const shouldShowWrapper = location.pathname !== '/' && location.pathname !== '/guest';

  const token = localStorage.getItem('token');

  // Function to handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (token && !isTokenExpired(token)) {

      try {
        const fetchUserProfile = async () => {
          const response = await profile();

          const data = response.data as any;
          setUser(data.user)
        }

        fetchUserProfile();

      } catch (error) {
        console.error("Error decoding token on initial load:", error);
        handleLogout();
        return;
      }
    } else {
      handleLogout();
    }

  }, [handleLogout]);

  return (
    <>
      {shouldShowWrapper && (
        <ScreenWrapper>
          <Header />
        </ScreenWrapper>
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
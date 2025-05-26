import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import { AppUserProvider, useAppUser } from './context/AppUser.context';
import AppServerMsgContext from "./context/AppServerMsg";
import './App.css';
import UserProfile from './components/UserProfile';
import WelcomeScreen from './components/WelcomScreen';
import CampaignList from './components/CampaignList';
import Messages from './components/Message/Messages';
import { profile } from './api/auth';
import GuestPage from './components/GuestPage';
import FloatingActions from './components/FloatingActions';
import { isTokenExpired } from './utils/isTokenExpired';
import Paths from './enum/Paths.enum';
import NotFound from './pages/NotFound';
import PrivacyBanner from './components/PrivacyBanner';
import LanguageToggle from './components/LanguageToggle';
import AccessDenied from './components/AccessDenied';


const App: React.FC = () => {
  const [serverMsg, setServerMsg] = useState('');

  const updateServerMsgContext = (msg: any) => { setServerMsg(msg) }

  return (
    <AppServerMsgContext.Provider value={{ updateServerMsgContext, serverMsg }}>
      <AppUserProvider>
        <Router>
          <AppContent />
          <PrivacyBanner />
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
  const shouldShowHeader = location.pathname !== Paths.ON_BOARDING && location.pathname !== Paths.GUEST;

  const shouldShowToggleLangButton = location.pathname === Paths.GUEST;

  const token = localStorage.getItem('token');

  const handleLogout = useCallback(() => {
    logout()
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === Paths.GUEST) return;

    (async () => {
      if (token) {
        if (!isTokenExpired(token)) {
          try {
            const response = await profile();
            const data = response.data as any;

            updateUserContext(data.user);
            updateAllowedResources(data.allowedResources);
          } catch (error) {
            console.error("Error decoding token or fetching profile:", error);
            handleLogout();
          }
        } else {
          handleLogout();
        }
      }
    })();
  }, [handleLogout, token, location.pathname]);

  return (
    <>
      {shouldShowHeader && (<FloatingActions />)}

      {shouldShowToggleLangButton &&
        <div style={styles.container}>
          <LanguageToggle />
        </div>}

      <Routes>
        <Route path={Paths.ON_BOARDING} element={<WelcomeScreen />} />
        <Route path={Paths.DASHBOARD} element={<Home />} />
        <Route path={Paths.CAMPAIGNS} element={<CampaignList />} />
        <Route path={Paths.MESSAGES} element={<Messages />} />
        <Route path={Paths.PROFILE} element={<UserProfile />} />
        <Route path={Paths.GUEST} element={<GuestPage />} />
        <Route path={Paths.ACCESS_DENIED} element={<AccessDenied />} />
        <Route path={Paths.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: '40px',
    left: '20px',
    backgroundColor: '#25D366',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'transform 0.2s ease-in-out',
  },
};
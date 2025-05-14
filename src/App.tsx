import React, { useCallback, useEffect } from 'react';
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
import Footer from './components/Footer';

const App: React.FC = () => {
  const [serverMsg, setServerMsg] = React.useState('');

  const updateServerMsgContext = (msg: any) => { setServerMsg(msg) }

  // const location = useLocation();

  // const notShowFotter = location.pathname === Paths.ON_BOARDING;

  return (
    <AppServerMsgContext.Provider value={{ updateServerMsgContext, serverMsg }}>
      <AppUserProvider>
        <Router>
          <AppContent />
          <PrivacyBanner />
          <Footer />
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

  const token = localStorage.getItem('token');

  const handleLogout = useCallback(() => {
    logout()
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === Paths.GUEST) return

    if (token && !isTokenExpired(token)) {

      try {
        const fetchUserProfile = async () => {
          const response = await profile();

          const data = response.data as any;

          updateUserContext(data.user);
          updateAllowedResources(data.allowedResources);
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
      {shouldShowHeader && (<FloatingActions />)}

      <Routes>
        <Route path={Paths.ON_BOARDING} element={<WelcomeScreen />} />
        <Route path={Paths.DASHBOARD} element={<Home />} />
        <Route path={Paths.CAMPAIGNS} element={<CampaignList />} />
        <Route path={Paths.MESSAGES} element={<Messages />} />
        <Route path={Paths.PROFILE} element={<UserProfile />} />
        <Route path={Paths.GUEST} element={<GuestPage />} />
        {/* <Route path={Paths.NOT_FOUND} element={<NotFound />} /> */}
      </Routes>
    </>
  )
}
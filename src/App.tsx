import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Typography } from '@mui/material';
import Home from './pages/Home';
import Header from './components/Header';
import ScreenWrapper from './components/ScreenWrapper';
import AppUserContext from './context/AppUserContext';
import AppServerMsgContext from "./context/AppServerMsg";
import './App.css';
import UserSelfArea from './components/UserSelfArea';
import WelcomeScreen from './components/WelcomScreen';

const App: React.FC = () => {
  const [crrUser, setUser] = React.useState<any>(null);
  const [serverMsg, setServerMsg] = React.useState('');

  const updateUserContext = (user: any) => { setUser(user) }
  const updateServerMsgContext = (msg: any) => { setServerMsg(msg) }

  return (
  <AppServerMsgContext.Provider value={{ updateServerMsgContext, serverMsg }}>
  <AppUserContext.Provider value={{ updateUserContext, user: crrUser }}>
      <Router>

         <ScreenWrapper><Header /></ScreenWrapper>

        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserSelfArea />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </Router>
      </AppUserContext.Provider>
  </AppServerMsgContext.Provider>
  )
}

export default App;

export const NotFound: React.FC = () => {
  return (
    <Typography variant="h3" align="center" gutterBottom>
      Not found
    </Typography>
  )
}
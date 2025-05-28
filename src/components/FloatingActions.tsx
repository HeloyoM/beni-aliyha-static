import { SpeedDial, SpeedDialAction, SpeedDialIcon, useMediaQuery } from '@mui/material';
import { Home, PersonStanding, LogOut, Presentation, Mail, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import LanguageToggle from './LanguageToggle';

const FloatingActions = () => {
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleLogout = async () => {
    try {
      const response = await logout();

      const data = response.data as any;

      if (data) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')

        navigate('/')
      }

    } catch (error) {

    }
  }

  const actions = [
    { icon: <Home size={20} />, name: 'Home', onClick: () => navigate('/home') },
    { icon: <PersonStanding size={20} />, name: 'Profile', onClick: () => navigate('/profile') },
    { icon: <Mail size={20} />, name: 'Messages', onClick: () => navigate('/messages') },
    { icon: <LogOut size={20} />, name: 'Logout', onClick: handleLogout },
    { icon: <LanguageToggle />, name: 'Lang', onlick: () => { } }
  ];
  if (!isMobile) {
    actions.push({ icon: <Presentation size={20} />, name: 'Campaigns', onClick: () => navigate('/campaings') })
  }

  return (
    <SpeedDial
      ariaLabel="Navigation actions"
      sx={{ position: 'fixed', bottom: 40, right: 30 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

export default FloatingActions;

import React, { useEffect, useMemo } from 'react';
import { Button, Typography } from "@mui/material";
import '../App.css';
import Menu from './Menu';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
    const [openMenu, setOpenMenu] = React.useState(false);

    const navigate = useNavigate();

    const openMenuModal = () => { setOpenMenu(true) }
    const closeMenuModal = () => { setOpenMenu(false) }

    const showProfile = () => navigate('/profile')

    const optionsListItems = useMemo(() => ([
        <Button sx={[
            {
                height: '100px',
                fontSize: '30px',
                fontFamily: "Sora, sens-serif",
                '&:hover': {
                    color: 'white',
                    backgroundColor: '#244545',
                },
            },]}>section</Button>
    ]), [])

    const handleLogout = async () => {
        try {
            const response = await logout()

            const data = response.data as any;

            if (data) {
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')

                navigate('/')
            }

        } catch (error) {

        }
    }

    return (
        <Typography className={'sticky title'}>

            <PersonIcon sx={{ height: 55, width: 55 }} onClick={showProfile} />

            <LogoutIcon onClick={handleLogout} />

            <Typography
                style={{
                    margin: 'auto auto',
                    fontSize: '22px'
                }}>Website name
            </Typography>

            {!openMenu && <MenuIcon onClick={openMenuModal} className="menu-btn" />}

            <Menu menuBody={optionsListItems} close={closeMenuModal} openMenu={openMenu} />

        </Typography>
    )
}

export default Header;
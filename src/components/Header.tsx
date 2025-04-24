import React, { JSX, useMemo } from 'react';
import { Box, Button, Typography } from "@mui/material";
import '../App.css';
import Menu from './Menu';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import CampaignIcon from '@mui/icons-material/Campaign';
import HomeIcon from '@mui/icons-material/Home';

type Props = {
    name: string
    icon: JSX.Element
    onClick: () => void
}

const NatbarButton = ({ name, icon, onClick }: Props) => {
    return (
        <Box
            onClick={onClick}
            sx={{
                'color': '#46484a',
                'borderRadius': '10px',
                margin: '3px 3px',
                '&:hover': {
                    bgcolor: 'rgb(52, 171, 83)',
                },
            }}
        >
            <Box component={'div'}
                style={{
                    'border': '1px solid rgb(52, 171, 83)',
                    'boxShadow': ' rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                    'backgroundColor': '#fff',
                    'height': '72px',
                    'flexDirection': 'column',
                    'width': '72px',
                    'padding': '3%',
                    'borderRadius': '10px',
                    'cursor': 'pointer',
                    'display': 'flex',
                    'justifyContent': 'center',
                    'alignItems': 'center'
                }}
            >
                {icon}
                <Box sx={{
                    fontSize: '15px'
                }}>
                    {name}
                </Box>
            </Box>
        </Box >
    )
}

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

    const showCampaigns = () => {
        navigate('/campaings')
    }
    const navigateHome = () => {
        navigate('/home')
    }
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
        <Box className={'sticky title'}>

            <NatbarButton name='home' icon={<HomeIcon sx={{ height: 35, width: 35 }} />} onClick={navigateHome} />
            <NatbarButton name='profile' icon={<PersonIcon sx={{ height: 35, width: 35 }}/>} onClick={showProfile}/>
            
            <NatbarButton name='logout' icon={<LogoutIcon sx={{ height: 35, width: 35 }} />} onClick={handleLogout} />
            
            <NatbarButton name='campaigns' icon={<CampaignIcon sx={{ height: 35, width: 35 }} />} onClick={showCampaigns} />
            

            <Typography
                style={{
                    margin: 'auto auto',
                    fontSize: '22px'
                }}>Website name
            </Typography>

            {/* {!openMenu && <MenuIcon onClick={openMenuModal} className="menu-btn" />}

            <Menu menuBody={optionsListItems} close={closeMenuModal} openMenu={openMenu} /> */}

        </Box>
    )
}

export default Header;
import React from 'react';
import '../App.css';
import { Box } from '@mui/material';
import Footer from '../components/Footer';
import Campaign from '../components/Campaign';

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <Box sx={{
        position: 'fixed',
        height: '100vh',
        width: '100vw',
      }}>

        <Campaign />

      </Box>

      <Footer />
    </React.Fragment>
  )
}

export default Home;
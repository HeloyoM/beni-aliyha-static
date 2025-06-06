import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsappButton: React.FC = () => {
    const handleClick = () => {
        window.open(`https://chat.whatsapp.com/Gq6mmGhdezlJwVg1lYWnrH`, '_blank');
    };

    return (
        <div style={styles.container} onClick={handleClick}>
            <WhatsAppIcon />
        </div>
    );
};

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

export default WhatsappButton;

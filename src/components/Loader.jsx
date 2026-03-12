// Loader.jsx - Material UI Version
import { CircularProgress, Box } from '@mui/material';

const Loader = () => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      }}
    >
      <CircularProgress 
        size={80} 
        thickness={4} 
        sx={{ 
          color: '#ec4899', // pink-500
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
    </Box>
  );
};

export default Loader;


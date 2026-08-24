import { Box, CircularProgress } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <CircularProgress size={80} thickness={4} />
    </Box>
  );
};

export default Loader;

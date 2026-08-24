import { Typography } from '@mui/material';

import Header from './Layout';

const NotFound = () => {
  return (
    <>
      <Header />
      <Typography variant="h5" align="center" fontWeight={700} sx={{ my: 5 }}>
        Page not found!
      </Typography>
    </>
  );
};

export default NotFound;

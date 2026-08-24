import { AppBar, Box, Button, Stack, Toolbar } from '@mui/material';
import Cookies from 'js-cookie';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

import { useLogin } from '../context/LoginContext';
import { useModal } from '../context/ModalContext';
import LoginForm from './LoginForm';
import Modal from './Modal';
import SignupForm from './SignupForm';

const navButtonSx = {
  borderRadius: 999,
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1, sm: 1.5 },
  color: 'text.primary',
  '&:hover': {
    bgcolor: 'background.default',
    color: 'text.primary'
  },
  '&.MuiButton-contained': {
    color: '#fff',
    '&:hover': {
      color: '#fff',
      bgcolor: 'primary.dark'
    }
  }
};

const Header = () => {
  const location = useLocation();
  const token = Cookies.get('token');

  const { modal, setModal } = useModal();
  const { login, setLogin } = useLogin();
  if (token) {
    setLogin(true);
  }
  const navigate = useNavigate();

  const onCreateClick = () => {
    if (!login) {
      setModal('login');
      navigate('/', { state: { from: '/post/create' } });
    } else {
      navigate('/post/create');
    }
  };

  const onLoginClick = () => {
    setModal('login');
  };

  const onLogoutClick = async () => {
    setLogin(false);
    document.cookie = 'token=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;';
    sessionStorage.removeItem('token');
    navigate('/');
    toast.success('Logged out!');
  };

  const onSignupClick = () => {
    setModal('signup');
  };

  return (
    <Box>
      <AppBar position="static" elevation={0} color="secondary">
        <Toolbar
          sx={{
            minHeight: 80,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            px: { xs: 1, sm: 2, md: 4, lg: 6 }
          }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={NavLink}
              to="/"
              variant={location.pathname === '/' ? 'contained' : 'text'}
              sx={navButtonSx}>
              Home
            </Button>
            <Button
              type="button"
              onClick={onCreateClick}
              variant={location.pathname === '/post/create' ? 'contained' : 'text'}
              sx={navButtonSx}>
              Create
            </Button>
          </Stack>

          {login ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                component={NavLink}
                to="/profile/me"
                variant={location.pathname === '/profile/me' ? 'contained' : 'text'}
                sx={navButtonSx}>
                Profile
              </Button>
              <Button type="button" onClick={onLogoutClick} sx={navButtonSx}>
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                type="button"
                onClick={onLoginClick}
                variant={modal === 'login' ? 'contained' : 'text'}
                sx={navButtonSx}>
                Login
              </Button>
              {modal === 'login' && (
                <Modal>
                  <LoginForm />
                </Modal>
              )}
              <Button
                type="button"
                onClick={onSignupClick}
                variant={modal === 'signup' ? 'contained' : 'text'}
                sx={navButtonSx}>
                Sign Up
              </Button>
              {modal === 'signup' && (
                <Modal>
                  <SignupForm />
                </Modal>
              )}
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Outlet />
      <Toaster />
    </Box>
  );
};

export default Header;

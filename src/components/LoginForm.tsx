import CloseIcon from '@mui/icons-material/Close';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useLogin } from '../context/LoginContext';
import { useModal } from '../context/ModalContext';
import { loginSchema } from '../schema/zodSchema';
import { LoginUser } from '../types';

const LoginForm = () => {
  const { setModal } = useModal();
  const { setLogin } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();

  const onCloseClick = () => {
    setModal(null);
  };
  const onSignupClick = () => {
    setModal('signup');
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginUser>({
    resolver: zodResolver(loginSchema)
  });

  const { mutate } = useMutation({
    mutationFn: async (data: LoginUser) => {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register user');
        }
        return await response.json();
      } catch (error) {
        throw new Error(`Failed to register user: ${error}`);
      }
    },
    onSuccess: (data) => {
      if (data.message !== 'login successful') {
        //toast.error(` ${data.message}`);
      }
      document.cookie = `token=${data.token}; path=/;`;
      toast.success('Logged in successfully!');
      setModal(null);
      setLogin(true);

      const state = location.state;
      if (state != null) {
        state.from === '/post/create' ? navigate('/post/create') : '';
      }
    },
    onError: (error) => {
      let errorMessage = 'login unsuccessful';
      if (error.message.includes('User does not exist')) {
        errorMessage = 'User does not exist!';
      }
      if (error.message.includes('Invalid password!')) {
        errorMessage = 'Incorrect password!';
      }
      toast.error(` ${errorMessage}`);
    }
  });

  const submitData: SubmitHandler<LoginUser> = (data) => {
    mutate(data);
  };

  const emailField = register('email');
  const passwordField = register('password');

  return (
    <Box sx={{ position: 'relative', p: { xs: 3, sm: 4 } }}>
      <IconButton
        aria-label="close"
        onClick={onCloseClick}
        sx={{ position: 'absolute', right: 8, top: 8, color: 'primary.main' }}>
        <CloseIcon />
      </IconButton>
      <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Avatar
          src="/photoshare1.png"
          alt="logo"
          sx={{ width: { xs: 40, md: 80 }, height: { xs: 40, md: 80 }, bgcolor: 'secondary.main' }}
        />
        <Typography variant="h5" fontWeight={600}>
          PhotoShare
        </Typography>
        <Typography variant="h6" fontWeight={700}>
          Login
        </Typography>
      </Stack>
      <Box component="form" onSubmit={handleSubmit(submitData)} noValidate>
        <TextField
          fullWidth
          margin="normal"
          type="email"
          label="Your email"
          placeholder="name@company.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          name={emailField.name}
          onChange={emailField.onChange}
          onBlur={emailField.onBlur}
          inputRef={emailField.ref}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          placeholder="••••••••"
          error={!!errors.password}
          helperText={errors.password?.message}
          name={passwordField.name}
          onChange={passwordField.onChange}
          onBlur={passwordField.onBlur}
          inputRef={passwordField.ref}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }}>
          Login
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Don&apos;t have an account?{' '}
          <Link component="button" type="button" onClick={onSignupClick} underline="hover">
            Sign Up here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;

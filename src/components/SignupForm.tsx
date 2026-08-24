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
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { signupSchema } from '../schema/zodSchema';
import { Users } from '../types';

const SignupForm = () => {
  const { setModal } = useModal();

  const onCloseClick = () => {
    setModal(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Users>({
    resolver: zodResolver(signupSchema)
  });

  const { mutate } = useMutation({
    mutationFn: async (data: Users) => {
      try {
        const response = await fetch('http://localhost:5000/register', {
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

    onSuccess: () => {
      setModal('login');
      toast.success('Registered Successfully!');
    },
    onError: (error) => {
      let errorMessage = 'Registration unsuccessful';
      if (error.message.includes('User already exists')) {
        errorMessage = 'User email already exists, please use another email!';
      }
      if (error.message.includes('Username exists')) {
        errorMessage = 'Username already exists, please use a new one!';
      }
      toast.error(` ${errorMessage}`);
    }
  });

  const submitData: SubmitHandler<Users> = (data) => {
    mutate(data);
  };
  const onLoginClick = () => {
    setModal('login');
  };

  const usernameField = register('username');
  const firstNameField = register('firstName');
  const lastNameField = register('lastName');
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
      <Stack alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Avatar
          src="/photoshare1.png"
          alt="logo"
          sx={{ width: { xs: 40, md: 80 }, height: { xs: 40, md: 80 }, bgcolor: 'secondary.main' }}
        />
        <Typography variant="h5" fontWeight={600}>
          PhotoShare
        </Typography>
        <Typography variant="h6" fontWeight={700}>
          Create an account
        </Typography>
      </Stack>
      <Box component="form" onSubmit={handleSubmit(submitData)} noValidate>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          placeholder="Username"
          error={!!errors.username}
          helperText={errors.username?.message}
          name={usernameField.name}
          onChange={usernameField.onChange}
          onBlur={usernameField.onBlur}
          inputRef={usernameField.ref}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            placeholder="First Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            name={firstNameField.name}
            onChange={firstNameField.onChange}
            onBlur={firstNameField.onBlur}
            inputRef={firstNameField.ref}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            placeholder="Last Name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            name={lastNameField.name}
            onChange={lastNameField.onChange}
            onBlur={lastNameField.onBlur}
            inputRef={lastNameField.ref}
          />
        </Stack>
        <TextField
          fullWidth
          margin="normal"
          type="email"
          label="Your email"
          placeholder="name@email.com"
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
          Create an account
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link component="button" type="button" onClick={onLoginClick} underline="hover">
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupForm;

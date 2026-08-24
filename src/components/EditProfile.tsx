import CloseIcon from '@mui/icons-material/Close';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { queryClient } from '../main';
import { userDetailsSchema, userSchema } from '../schema/zodSchema';
import { UserDetail } from '../types';

interface FormData {
  firstName: string;
  lastName: string;
  about: string;
}
const EditProfile = ({ firstName, lastName, about, id }: UserDetail) => {
  const token = Cookies.get('token');
  const { setModal } = useModal();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(userDetailsSchema)
  });
  const { mutate } = useMutation({
    mutationFn: async (data: userSchema) => {
      const formData = new FormData();

      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('about', data.about);

      const response = await fetch(`http://localhost:5000/profile/edit/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        toast.error('Failed to update!');
        throw new Error('Failed to update data');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User data updated successfully');
      setModal(null);
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });

  const submitData = (data: FormData) => {
    mutate(data);
  };

  const onCloseClick = () => {
    setModal(null);
  };
  useEffect(() => {
    if (firstName) {
      setValue('firstName', firstName);
    }
    if (lastName) {
      setValue('lastName', lastName);
    }
    if (about) {
      setValue('about', about);
    }
  }, [firstName, lastName, about, setValue]);

  const firstNameField = register('firstName');
  const lastNameField = register('lastName');
  const aboutField = register('about');

  return (
    <Box sx={{ position: 'relative', p: 3 }}>
      <IconButton
        aria-label="close"
        onClick={onCloseClick}
        sx={{ position: 'absolute', right: 8, top: 8, color: 'primary.main' }}>
        <CloseIcon />
      </IconButton>
      <Box component="form" onSubmit={handleSubmit(submitData)} sx={{ pt: 2 }}>
        <Typography variant="h6" color="primary" fontWeight={600} sx={{ mb: 2 }}>
          Edit Profile Details
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="First name"
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
          label="Last name"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          name={lastNameField.name}
          onChange={lastNameField.onChange}
          onBlur={lastNameField.onBlur}
          inputRef={lastNameField.ref}
        />
        <TextField
          fullWidth
          margin="normal"
          multiline
          rows={3}
          label="About"
          error={!!errors.about}
          helperText={errors.about?.message}
          name={aboutField.name}
          onChange={aboutField.onChange}
          onBlur={aboutField.onBlur}
          inputRef={aboutField.ref}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;

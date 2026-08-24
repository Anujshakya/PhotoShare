import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PostData, postUpdateSchema } from '../schema/zodSchema';

const EditPost = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { sentFrom, postId, image, caption, description } = location.state || {};

  const token = Cookies.get('token');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PostData>({
    resolver: zodResolver(postUpdateSchema)
  });

  const { mutate } = useMutation({
    mutationFn: async (data: PostData) => {
      const formData = new FormData();
      formData.append('postCaption', data.caption);
      formData.append('postDesc', data.description);

      const response = await fetch(`http://localhost:5000/user/post/${postId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        toast.error('Failed to update!');
        throw new Error('Failed to edit post');
      }
    },
    onSuccess: () => {
      toast.success('Post updated successfully');
      navigate(`/post/view/${postId}`);
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });
  useEffect(() => {
    if (image) {
      setImagePreview(image.replace('public\\images\\', 'images/'));
    }
    if (caption) {
      setValue('caption', caption);
    }
    if (description) {
      setValue('description', description);
    }
  }, [image, caption, description, setValue]);

  const submitData = (data: PostData) => {
    mutate(data);
  };
  if (sentFrom != '/post/view') {
    return (
      <Typography variant="h5" align="center" fontWeight={700}>
        Not authorized!
      </Typography>
    );
  }

  const captionField = register('caption');
  const descriptionField = register('description');

  return (
    <Box>
      <Typography
        variant="h5"
        align="center"
        color="primary"
        fontWeight={700}
        sx={{ my: 3 }}>
        Edit Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit(submitData)}>
        <Box
          sx={{
            m: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            minHeight: '100vh'
          }}>
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                mx: 5,
                height: '70%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <Box
                component="img"
                src={`http://localhost:5000/${imagePreview}`}
                alt="Image Preview"
                sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, objectFit: 'cover' }}
              />
            </Box>
          </Box>
          <Box sx={{ px: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Caption"
              error={!!errors.caption}
              helperText={errors.caption?.message}
              name={captionField.name}
              onChange={captionField.onChange}
              onBlur={captionField.onBlur}
              inputRef={captionField.ref}
            />
            <TextField
              fullWidth
              margin="normal"
              multiline
              rows={6}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              name={descriptionField.name}
              onChange={descriptionField.onChange}
              onBlur={descriptionField.onBlur}
              inputRef={descriptionField.ref}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }}>
              Update Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditPost;

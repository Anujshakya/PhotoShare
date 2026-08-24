import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PostData, postSchema } from '../schema/zodSchema';

const CreatePost = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const token = Cookies.get('token');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PostData>({
    resolver: zodResolver(postSchema)
  });

  const { mutate } = useMutation({
    mutationFn: async (data: PostData) => {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }
      formData.append('postCaption', data.caption);
      formData.append('postDesc', data.description);

      const response = await fetch('http://localhost:5000/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error('Failed to create post');
      }
    },
    onSuccess: () => {
      navigate('/profile/me');

      toast.success('Post added successfully');
    },
    onError: (error) => {
      error.message.includes('jwt malformed');
      const errorMessage = 'You are not authorized!';

      toast.error(`An error occurred. ${errorMessage}`);
    }
  });

  const submitData = (data: PostData) => {
    mutate(data);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setValue('image', selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  if (!token) {
    return (
      <Typography variant="h5" align="center" fontWeight={700}>
        You are not authorized!
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
        Create Post
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
              component="label"
              sx={{
                mx: 5,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                ...(imagePreview
                  ? { height: '70%' }
                  : {
                      cursor: 'pointer',
                      justifyContent: 'center',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      bgcolor: 'grey.50',
                      height: { lg: '70%' },
                      '&:hover': { bgcolor: 'grey.100' }
                    })
              }}>
              <input
                id="dropzone-file"
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileInputChange}
              />
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Image Preview"
                  sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, objectFit: 'cover' }}
                />
              ) : (
                <Stack alignItems="center" spacing={1} sx={{ py: 3 }}>
                  <CloudUploadIcon />
                  <Typography variant="body2" color="text.secondary">
                    <Box component="span" fontWeight={600}>
                      Click to upload image
                    </Box>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SVG, PNG, JPG
                  </Typography>
                </Stack>
              )}
              {errors.image && (
                <Typography color="error">{errors.image.message as string}</Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ px: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Caption"
              placeholder="Your caption"
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
              placeholder="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              name={descriptionField.name}
              onChange={descriptionField.onChange}
              onBlur={descriptionField.onBlur}
              inputRef={descriptionField.ref}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }}>
              Create Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;

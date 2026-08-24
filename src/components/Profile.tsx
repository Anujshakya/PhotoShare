import EditIcon from '@mui/icons-material/Edit';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ChangeEvent, MouseEvent, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { queryClient } from '../main';
import { PostData, userPhotoSchema } from '../schema/zodSchema';
import { PhotoDetail, UserProfile } from '../types';
import EditProfile from './EditProfile';
import Loader from './Loader';
import Modal from './Modal';
import UserPosts from './UserPosts';

interface DecodedToken extends JwtPayload {
  userId: string;
}

const Profile = () => {
  const {
    formState: { errors }
  } = useForm<PostData>({
    resolver: zodResolver(userPhotoSchema)
  });
  const token = Cookies.get('token');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoMenuAnchor, setPhotoMenuAnchor] = useState<null | HTMLElement>(null);
  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const avatarEditorRef = useRef<AvatarEditor>(null);

  let id: string | undefined;
  let decoded: DecodedToken | null = null;
  const { userIdParams } = useParams<{ userIdParams: string }>();

  const { modal, setModal } = useModal();

  if (token) {
    decoded = jwtDecode(token);
  }

  if (decoded) {
    id = decoded.userId;
  }

  const handleEditClick = () => {
    setModal('edit');
  };

  const { mutate: mutatePhoto } = useMutation({
    mutationFn: async (data: PhotoDetail) => {
      const formData = new FormData();
      if (data?.userImg) {
        formData.append('image', data.userImg);
      }

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
        throw new Error('Failed to update photo');
      }
    },
    onSuccess: () => {
      console.warn('Photo updated!');
      toast.success('Photo updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });

  const { mutate: deletePhoto } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:5000/profile/edit/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error('Failed to delete photo');
      }
    },
    onSuccess: () => {
      toast.success('Photo deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      toast.error('An error occurred while deleting the photo');
    }
  });

  const getUrl = () => {
    if (!id) {
      return `http://localhost:5000/profile/${userIdParams}`;
    }
    if (userIdParams && id !== userIdParams) {
      return `http://localhost:5000/profile/${userIdParams}`;
    }
    return `http://localhost:5000/profile/me/${id}`;
  };

  const { isLoading, isError, data, error } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch(getUrl());
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
    enabled: !!userIdParams || !!id
  });

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data) {
    return (
      <Typography variant="h5" align="center" fontWeight={700}>
        An error occurred. No data received.
      </Typography>
    );
  }

  const userData = data.userdata;
  const userPhoto = userData.userImg || '';
  const userId: string = userData.id || '';

  if (!userData) {
    return (
      <Typography variant="h5" align="center" fontWeight={700}>
        An error occurred. User data is missing.
      </Typography>
    );
  }

  const handlePhotoMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setPhotoMenuAnchor(event.currentTarget);
  };

  const handlePhotoMenuClose = () => {
    setPhotoMenuAnchor(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handlePhotoMenuClose();
    if (file) {
      setSelectedFile(file);
      setIsAvatarEditorOpen(true);
    }
  };

  const handleDeletePhoto = () => {
    handlePhotoMenuClose();
    deletePhoto();
  };

  const handleCrop = () => {
    if (avatarEditorRef.current) {
      const canvas = avatarEditorRef.current.getImage();
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
          mutatePhoto({
            userImg: croppedFile
          });
          setIsAvatarEditorOpen(false);
        }
      });
    }
  };

  const isOwnProfile = id === userId;
  const photoMenuOpen = Boolean(photoMenuAnchor);

  return (
    <Container sx={{ py: 3 }}>
      {modal === 'edit' ? (
        <Modal>
          <EditProfile
            userImg="null"
            id={userId}
            firstName={userData.firstName}
            lastName={userData.lastName}
            about={userData.about || ''}
          />
        </Modal>
      ) : null}
      <Box sx={{ mb: 5, ml: { md: 5 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 5 }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              src={
                userPhoto
                  ? `http://localhost:5000/${userPhoto.replace('public\\images\\', 'images/')}`
                  : 'https://via.placeholder.com/150'
              }
              alt="User Avatar"
              sx={{ width: { xs: 160, md: 192 }, height: { xs: 160, md: 192 } }}
            />
            {isOwnProfile && (
              <IconButton
                onClick={handlePhotoMenuOpen}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'grey.300',
                  '&:hover': { bgcolor: 'grey.400' }
                }}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <Menu anchorEl={photoMenuAnchor} open={photoMenuOpen} onClose={handlePhotoMenuClose}>
              <MenuItem component="label">
                Edit Photo
                <input type="file" hidden onChange={handleFileChange} />
              </MenuItem>
              {errors.image && <MenuItem disabled>{errors.image.message as string}</MenuItem>}
              <MenuItem onClick={handleDeletePhoto}>Delete Photo</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
              <Typography variant="h5" fontWeight={700}>
                {userData.firstName} {userData.lastName}
              </Typography>
              {isOwnProfile && (
                <IconButton
                  onClick={handleEditClick}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'secondary.main', color: 'text.primary' }
                  }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
            <Typography color="text.secondary" sx={{ p: 1 }}>
              @{userData.username}
            </Typography>
            <Typography color="text.secondary" sx={{ p: 1 }}>
              {userData.about}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" align="center" fontWeight={700}>
            Posts
          </Typography>
          {userIdParams !== undefined ? (
            <UserPosts userIdParams={userIdParams} />
          ) : (
            <UserPosts userIdParams={undefined} />
          )}
        </Box>
      </Box>

      <Dialog open={isAvatarEditorOpen} onClose={() => setIsAvatarEditorOpen(false)}>
        <DialogContent>
          <AvatarEditor
            ref={avatarEditorRef}
            image={selectedFile ?? ''}
            width={250}
            height={250}
            borderRadius={150}
            scale={1.2}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button color="error" variant="contained" onClick={() => setIsAvatarEditorOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCrop} disabled={isLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;

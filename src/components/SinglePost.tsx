import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Avatar,
  Box,
  Card,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useModal } from '../context/ModalContext';
import { JwtPayload } from '../types';
import DeleteModal from './DeleteModal';
import Loader from './Loader';
import Modal from './Modal';

const SinglePost = () => {
  const token = Cookies.get('token');
  let id: number | string | undefined;
  const { modal, setModal } = useModal();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isLandscape, setIsLandscape] = useState(true);

  const { isLoading, error, data } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetch(`http://localhost:5000/post/${postId}`).then((res) => res.json())
  });

  useEffect(() => {
    if (data && data.postData && data.postData.postImg) {
      const img = new Image();
      img.src = `http://localhost:5000/${data.postData.postImg.replace('public\\images\\', 'images/')}`;
      img.onload = () => {
        setIsLandscape(img.width > img.height);
      };
    }
  }, [data]);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error) return <div>An error occurred: {error.message}</div>;

  const post = data.postData;
  const user = post.userRegistration;

  let decoded: JwtPayload | null = null;
  if (token) {
    decoded = jwtDecode(token);
  }

  if (decoded) {
    id = decoded.userId;
  }

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/post/edit/${post.postId}`, {
      state: {
        sentFrom: '/post/view',
        postId: post.postId,
        image: post.postImg,
        caption: post.postCaption,
        description: post.postDesc
      }
    });
  };
  const handleDelete = () => {
    handleMenuClose();
    setModal('delete');
  };
  const handleProfileClick = () => {
    if (id && id == user.id) {
      navigate(`/profile/me`);
    }
    navigate(`/profile/${user.id}`);
  };

  const dropdownOpen = Boolean(anchorEl);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Card
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '80%',
            maxHeight: '90vh',
            p: 2
          }}>
          <Box
            sx={{
              flex: 1,
              width: { md: '50%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: 2,
              maxHeight: isLandscape ? '70vh' : '100%'
            }}>
            <Box
              component="img"
              sx={{
                borderRadius: 2,
                objectFit: 'cover',
                maxHeight: isLandscape ? '70vh' : '100%',
                width: '100%'
              }}
              src={`http://localhost:5000/${data.postData.postImg.replace('public\\images\\', 'images/')}`}
              alt=""
            />
          </Box>

          <Box
            sx={{
              mt: { xs: 2, md: 0 },
              width: { md: '50%' },
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              borderRadius: 2
            }}>
            {decoded && decoded.userId === user.id && (
              <Box sx={{ position: 'absolute', right: 24, top: 8 }}>
                <IconButton onClick={handleMenuOpen}>
                  <MoreHorizIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={dropdownOpen} onClose={handleMenuClose}>
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                  <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            )}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
              <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                <Avatar
                  src={
                    user.userImg
                      ? `http://localhost:5000/${user.userImg.replace('public\\images\\', 'images/')}`
                      : 'https://via.placeholder.com/150'
                  }
                  alt="User Avatar"
                  sx={{ width: 48, height: 48 }}
                />
              </IconButton>
              <Box>
                <Typography
                  component="button"
                  onClick={handleProfileClick}
                  fontWeight={600}
                  sx={{
                    border: 0,
                    background: 'none',
                    cursor: 'pointer',
                    p: 0,
                    font: 'inherit'
                  }}>
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(post.postedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                {post.postCaption}
              </Typography>
              <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                {post.postDesc}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {modal === 'delete' && (
        <Modal>
          <DeleteModal postId={postId} />
        </Modal>
      )}
      <Toaster />
    </Box>
  );
};

export default SinglePost;

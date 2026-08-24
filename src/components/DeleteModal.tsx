import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import react from 'react';

import { useModal } from '../context/ModalContext';
import { useDeleteQuery } from '../query/queries';

interface DeleteModalProps {
  postId?: string;
}

const DeleteModal: react.FC<DeleteModalProps> = ({ postId }) => {
  const mutateDeletePost = useDeleteQuery();
  const { setModal } = useModal();

  const handleDelete = () => {
    if (postId) {
      mutateDeletePost.mutate(postId);
    }
    return;
  };
  const handleClose = () => {
    setModal(null);
  };
  return (
    <Box sx={{ position: 'relative', p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <DeleteOutlineIcon fontSize="large" />
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Are you sure you want to delete this item?
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          No, cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Yes, delete
        </Button>
      </Stack>
    </Box>
  );
};

export default DeleteModal;

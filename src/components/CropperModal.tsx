import 'cropperjs/dist/cropper.css';

import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { queryClient } from '../main';

interface EditProfilePictureProps {
  image: string | File | null;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  setImagePreview: Dispatch<SetStateAction<string>>;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

const EditProfilePicture = ({
  image,
  selectedFile,
  setSelectedFile,
  setImagePreview
}: EditProfilePictureProps) => {
  const ACCEPTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png'];
  const [formError, setFormError] = useState<string | null>(null);
  const token = Cookies.get('token');
  const { setModal } = useModal();
  const cropperRef = useRef<ReactCropperElement>(null);

  let id: string | undefined;
  let decoded: DecodedToken | null = null;

  if (token) {
    decoded = jwtDecode(token);
  }

  if (decoded) {
    id = decoded.userId;
  }

  const { mutate } = useMutation({
    mutationKey: ['updateProfilePic'],
    mutationFn: (data: FormData) =>
      fetch(`http://localhost:5000/profile/edit/${id}`, {
        method: 'PATCH',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update profile picture');
        }
        return res.json();
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile Picture Updated');
      setModal(null);
      setSelectedFile(null);
      setImagePreview('');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile picture');
    }
  });

  useEffect(() => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      if (cropper) {
        // Optionally configure cropper settings
      }
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type.toLowerCase())) {
        setFormError('Only JPEG and PNG images are allowed');
        setSelectedFile(null);
        setImagePreview('');
      } else {
        setFormError(null);
        setSelectedFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const saveCroppedImage = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      if (cropper) {
        cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
          if (blob) {
            const croppedFile = new File([blob], 'cropped_image.png', {
              type: 'image/png'
            });
            setSelectedFile(croppedFile);
            setModal(null);
            const formData = new FormData();
            formData.append('image', croppedFile);
            mutate(formData);
          }
        });
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative', aspectRatio: '1 / 1', width: '83%' }}>
        <Cropper
          ref={cropperRef}
          style={{ width: '100%', height: '100%' }}
          aspectRatio={1}
          src={typeof image === 'string' ? image : image ? URL.createObjectURL(image) : undefined}
          guides={true}
          viewMode={1}
        />
        <IconButton
          component="label"
          htmlFor="image"
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' }
          }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
      <input type="file" id="image" hidden accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
      {formError && (
        <Typography color="error" variant="body2">
          {formError}
        </Typography>
      )}
      <Button
        type="button"
        variant="contained"
        onClick={saveCroppedImage}
        disabled={!selectedFile}
        sx={{ width: '83%', py: 1.5 }}>
        Save
      </Button>
    </Box>
  );
};

export default EditProfilePicture;

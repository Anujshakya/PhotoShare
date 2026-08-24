import { Dialog } from '@mui/material';
import { ReactNode } from 'react';

import { useModal } from '../context/ModalContext';

const SignupModal = ({ children }: { children: ReactNode }) => {
  const { setModal } = useModal();

  return (
    <Dialog
      open
      onClose={() => setModal(null)}
      maxWidth="sm"
      fullWidth
      scroll="body">
      {children}
    </Dialog>
  );
};

export default SignupModal;

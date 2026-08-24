import React, { createContext, ReactNode, useState } from 'react';
type modalType = 'login' | 'signup' | 'delete' | 'edit' | 'cropper' | null;
interface ModalContextValue {
  modal: modalType;
  setModal: React.Dispatch<React.SetStateAction<modalType>>;
}
// Create the context with an initial value
const ModalContext = createContext<ModalContextValue | undefined>(undefined);
interface ModalContextProviderProps {
  children: ReactNode;
}
function ModalContextProvider({ children }: ModalContextProviderProps) {
  const [modal, setModal] = useState<modalType>(null);

  const value = { modal, setModal };
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
export { ModalContextProvider as ModalContextProvider, useModal };

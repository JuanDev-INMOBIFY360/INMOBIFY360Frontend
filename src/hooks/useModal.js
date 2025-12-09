import { useState } from 'react';

/**
 * Hook para manejar el estado de modales
 * @returns {{ isOpen, onOpen, onClose, reset }}
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const reset = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    onOpen,
    onClose,
    reset
  };
};

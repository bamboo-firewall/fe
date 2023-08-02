import React, { ReactNode } from 'react';
import { Modal } from '@/UI';
import { CloseIcon } from '../icons';

interface Props {
  children: ReactNode;
  open: boolean;
  onCancel: () => void;
  title: string;
}

export const ModalApp: React.FC<Props> = ({ children, open, onCancel, title }) => {
  const modalTitle = (
    <div className="relative text-white flex items-center justify-center">
      <CloseIcon className="absolute right-0 text-[18px] cursor-pointer" onClick={onCancel} />
      <p className="m-0 text-[18px] text-center">{title}</p>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      closable={false}
      destroyOnClose
      footer={null}
      centered
    >
      {children}
    </Modal>
  );
};

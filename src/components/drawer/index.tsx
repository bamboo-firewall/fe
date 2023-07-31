import { Drawer } from '@/UI';
import React from 'react';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
}

const DrawerApp: React.FC<Props> = ({ children, onClose, open, title }) => {
  return (
    <Drawer
      title={title}
      width={'50%'}
      onClose={onClose}
      open={open}
      destroyOnClose
      getContainer={false}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      }}
    >
      {children}
    </Drawer>
  );
};

export default DrawerApp;

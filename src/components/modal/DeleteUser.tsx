/* eslint-disable no-unused-vars */
import { IUser } from '@/interfaces';
import { Button } from '@/UI';
import React from 'react';

interface Props {
  onSubmit: (id: string) => void;
  onCancel: () => void;
  user: IUser;
}

export const DeleteUser: React.FC<Props> = ({ onCancel, onSubmit, user }) => {
  return (
    <div>
      <div className="text-xl">Are you sure to delete user: </div>
      <div className="flex flex-col mt-4 gap-1">
        <div>
          Name: <span className="font-bold">{user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{user?.email}</span>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" danger onClick={() => onSubmit(user?.ID)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

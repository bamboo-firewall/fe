import { Button, Tag, message } from '@/UI';
import { AvatarApp } from '@/components/common/Avatar';
import { ModalApp } from '@/components/modal';
import { UpdateUser } from '@/components/modal/UpdateUser';
import { COLOR } from '@/configs/authorize';
import { APIResponse } from '@/interfaces';
import { useAuth } from '@/provider/AppProvider';
import React, { useState } from 'react';
import * as BambooService from '@/services/Bamboo.service';
import { useQueryClient } from '@tanstack/react-query';
import { UpdatePassword } from '@/components/modal/UpdatePassword';

const Profile = () => {
  const { userInfo } = useAuth();
  const [visible, setVisible] = useState({
    updateProfile: false,
    updatePass: false,
  });
  const queryClient = useQueryClient();

  return (
    <div className="bg-white h-full">
      <section className="section-profile-cover section-shaped my-0">
        <div className="shape shape-style-1 shape-default alpha-4">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i}></span>
          ))}
        </div>
      </section>
      <div className="relative">
        <div className="w-[35%] mx-auto h-[350px] bg-white relative -top-52 rounded card-shadow">
          <div className="flex justify-between relative h-1/2 p-4">
            <div></div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-16 card-shadow rounded-full">
              <AvatarApp size={180} textSize="text-4xl" />
            </div>
            <div className="flex flex-col gap-3">
              <Button
                type="primary"
                size="small"
                onClick={() => setVisible({ ...visible, updateProfile: true })}
              >
                Update profile
              </Button>
              <Button size="small" onClick={() => setVisible({ ...visible, updatePass: true })}>
                Update password
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col gap-1">
            <h1 className="text-4xl">{userInfo?.name}</h1>
            <p className="text-gray-400">{userInfo?.email}</p>
            <div>
              <Tag color={COLOR[userInfo?.role]}>{userInfo?.role}</Tag>
            </div>
          </div>
        </div>
      </div>
      <ModalApp
        title="Update profile"
        open={visible.updateProfile}
        onCancel={() => setVisible({ ...visible, updateProfile: false })}
      >
        <UpdateUser
          user={userInfo}
          isUpdateProfile
          onSubmit={async (values) => {
            const res: APIResponse = await BambooService.updateUser(values);
            setVisible({ ...visible, updateProfile: false });
            if (res?.error) {
              message.error(res.error);
              return;
            }
            message.success('Update user successfully');
            queryClient.invalidateQueries(['userInfo']);
          }}
        />
      </ModalApp>
      <ModalApp
        open={visible.updatePass}
        onCancel={() => setVisible({ ...visible, updatePass: false })}
        title="Update password"
      >
        <UpdatePassword
          user={userInfo}
          onSubmit={async (values) => {
            const res: APIResponse = await BambooService.updateUser(values);
            setVisible({ ...visible, updatePass: false });
            if (res?.error) {
              message.error(res.error);
              return;
            }
            message.success('Update user successfully');
            queryClient.invalidateQueries(['userInfo']);
          }}
        />
      </ModalApp>
    </div>
  );
};

export default Profile;

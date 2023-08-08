import { Button, Input, Form, message } from '@/UI';
import { APIResponse, ILoginResponse } from '@/interfaces';
import * as BambooService from '@/services/Bamboo.service';
import { useRouter } from 'next/router';
import React from 'react';

const Login = () => {
  const router = useRouter();

  const onFinish = async (values: any) => {
    const res: APIResponse<ILoginResponse> = await BambooService.login(values);
    if (res?.error) {
      message.error(res.error);
      return;
    }
    if (res?.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      router.push('/');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-[500px] bg-white p-12 rounded-sm">
        <div className="flex justify-center flex-col items-center">
          <img className="w-[70px]" src="./logo.png" alt="Logo" />
          <p className="mt-2 text-3xl font-light opacity-90">Login</p>
        </div>
        <div className="w-full">
          <Form initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
            <Form.Item name="username" rules={[{ required: true, message: 'Username is required!' }]}>
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Password is required!' }]}>
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Button type="primary" className="w-full " htmlType="submit">
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

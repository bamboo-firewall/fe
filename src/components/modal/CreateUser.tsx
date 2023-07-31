import { APIResponse } from '@/interfaces';
import { ISignUp } from '@/services/interfaces';
import * as BambooService from '@/services/Bamboo.service';
import React from 'react';
import { Button, Form, Input, Radio, message } from '@/UI';

interface Props {
  refetchUser: () => void;
  onClose: () => void;
}

export const CreateUser: React.FC<Props> = ({ refetchUser, onClose }) => {
  const onFinish = async (values: ISignUp) => {
    const res: APIResponse = await BambooService.createUser(values);
    if (res?.error) {
      message.error(res.error);
      return;
    }
    message.success('Create user successfully');
    refetchUser();
    onClose();
  };

  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 20 }} onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please choose user role!' }]}>
        <Radio.Group>
          <Radio value="admin"> Admin </Radio>
          <Radio value="user"> User </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

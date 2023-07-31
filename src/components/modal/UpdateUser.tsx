/* eslint-disable no-unused-vars */
import { Button, Form, Input, Radio } from '@/UI';
import { IUser } from '@/interfaces';
import React, { useEffect } from 'react';

interface Props {
  onSubmit: (values: any) => void;
  isUpdateProfile?: boolean;
  user: Omit<IUser, 'email'>;
}

export const UpdateUser: React.FC<Props> = ({ onSubmit, isUpdateProfile, user }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue('name', user?.name);
    form.setFieldValue('role', user?.role);
  }, [form, user]);

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 20 }}
      onFinish={(values) => onSubmit({ ...values, id: user?.ID || user?.user_id })}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
        <Input />
      </Form.Item>

      {!isUpdateProfile && (
        <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please choose user role!' }]}>
          <Radio.Group>
            <Radio value="admin"> Admin </Radio>
            <Radio value="user"> User </Radio>
          </Radio.Group>
        </Form.Item>
      )}

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

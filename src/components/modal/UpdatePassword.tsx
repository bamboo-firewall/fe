/* eslint-disable no-unused-vars */
import { Button, Form, Input } from '@/UI';
import { IUser } from '@/interfaces';
import React from 'react';
import lo from 'lodash';

interface Props {
  onSubmit: (values: any) => void;
  user: Omit<IUser, 'email'>;
}

export const UpdatePassword: React.FC<Props> = ({ onSubmit, user }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 20 }}
      onFinish={(values) => {
        const newValue = lo.omit(values, 'confirm');
        onSubmit({ ...newValue, id: user?.ID || user?.user_id });
      }}
    >
      <Form.Item
        label="New password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm password"
        name="confirm"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

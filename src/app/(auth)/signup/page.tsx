'use client';

import BaseButton from '@/app/atomics/button/BaseButton';
import BaseInput from '@/app/atomics/input/BaseInput';
import { Form } from 'antd';
import Link from 'next/link';
export default function LoginPage() {
  const onFinish = async () => {};

  return (
    <div className="w-full h-[100vh] flex flex-col align-center justify-center items-center px-[20px] md:px-[0px] bg-[#F5F5F5]">
      <div className="flex flex-col justify-center items-center w-full h-fit md:w-[420px] p-[20px] md:p-[40px] bg-white rounded-[16px]">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="w-full"
        >
          <p className="text-black text-[32px] font-[700] text-center leading-[130%]">Sign Up</p>
          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <BaseInput />
          </Form.Item>
          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <BaseInput />
          </Form.Item>

          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <BaseInput />
          </Form.Item>
          <Form.Item
            style={{ marginTop: '16px', marginBottom: '32px' }}
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please input your confirm password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords that you entered do not match!')
                  );
                },
              }),
            ]}
          >
            <BaseInput />
          </Form.Item>

          <Form.Item style={{ marginBottom: '0px' }}>
            <BaseButton customType="primaryActive" type="default" htmlType="submit" block>
              Sign Up
            </BaseButton>
          </Form.Item>
        </Form>
      </div>
      <div className="mt-[24px] flex justify-center items-center">
        <span>Already have an account?</span>
        <Link style={{ textDecoration: 'underline' }} className="mx-[5px]" href="/login">
          Log In
        </Link>
      </div>
    </div>
  );
}

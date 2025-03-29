'use client';

import BaseButton from '@/app/atomics/button/BaseButton';
import BaseInput from '@/app/atomics/input/BaseInput';
import { Form, message } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { useDispatch } from "react-redux";
import Link from 'next/link';
import { useContext, useState } from 'react';
import NotificationContext from '@/app/context/NotificationContext';
import { IconType } from 'antd/es/notification/interface';
export default function LoginPage() {
  const router = useRouter();
  const { api } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const onNotification = (description: string, type: IconType = 'error') => {
    api!.open({
      message: '',
      description,
      duration: 2,
      closeIcon: false,
      type: type,
    });
  };
  // const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const result = await signIn('login', {
        redirect: false,
        ...values,
      });

      if (result?.error) {
        onNotification(result?.error, 'error');
      } else {
        message.success('Login successful!');
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-black text-[32px] font-[700] text-center leading-[130%]">Log In</p>
          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid E-mail!' },
            ]}
          >
            <BaseInput />
          </Form.Item>

          <Form.Item
            style={{ marginTop: '16px', marginBottom: '32px' }}
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <BaseInput type="password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: '0px' }}>
            <BaseButton
              loading={isLoading}
              customType="primaryActive"
              type="default"
              htmlType="submit"
              block
            >
              Log In
            </BaseButton>
          </Form.Item>
        </Form>
      </div>
      <div className="mt-[24px] flex justify-center items-center">
        <span>Don’t have an account?</span>
        <Link style={{ textDecoration: 'underline' }} className="mx-[5px]" href="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

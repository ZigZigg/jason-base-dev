'use client';

import BaseButton from '@/atomics/button/BaseButton';
import BaseInput from '@/atomics/input/BaseInput';
import { Form, message } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { useDispatch } from "react-redux";
import Link from 'next/link';
import { useContext, useState } from 'react';
import NotificationContext from '@/context/NotificationContext';
import { IconType } from 'antd/es/notification/interface';

export default function SignInMain() {
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
        email: values.email.trim(), // Trim spaces from the email
      });

      if (result?.error) {
        onNotification(result?.error, 'error');
      } else {
        message.success('Login successful!');
        router.push('/subjects');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full h-[100vh] landscape:max-lg:h-[auto] flex flex-col align-center justify-center items-center px-[20px] landscape:max-lg:py-[24px] md:px-[0px] bg-[#F5F5F5]`}>
      <div className="flex flex-col justify-center items-center w-full h-fit md:w-[420px] p-[20px] md:p-[40px] bg-white rounded-[16px]">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="w-full auth-form"
        >
          <p className="text-black text-[32px] font-[700] text-center leading-[130%]">Log In</p>
          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { 
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  // Trim spaces from start and end before checking
                  const trimmedEmail = value.trim();
                  
                  // Check if there are any spaces in the middle
                  if (trimmedEmail.includes(' ')) {
                    return Promise.reject('The input is not valid email!');
                  }
                  
                  // Validate as standard email
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (emailRegex.test(trimmedEmail)) {
                    return Promise.resolve();
                  }
                  
                  return Promise.reject('The input is not valid email!');
                }
              }
            ]}
          >
            <BaseInput />
          </Form.Item>

          <Form.Item
            style={{ marginTop: '16px', marginBottom: '32px' }}
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                message: 'Password must be at least 6 characters, contain at least one uppercase and one lowercase letter!'
              }
            ]}
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
        <span className='text-[16px]'>Don’t have an account?</span>
        <Link style={{ textDecoration: 'underline' }} className="mx-[5px] text-[16px]!" href="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

'use client';

import BaseButton from '@/app/atomics/button/BaseButton';
import BaseInput from '@/app/atomics/input/BaseInput';
import NotificationContext from '@/app/context/NotificationContext';
import { Divider, Form, message } from 'antd';
import { IconType } from 'antd/es/notification/interface';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

export default function SignUpMain() {
  const router = useRouter();
  const { api } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      const trimmedValues = {
        ...values,
        email: values.email.trim(),
        name: values.name.trim(),
      };

     // Use Cognito signup API
     const response = await fetch('/api/auth/cognito-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trimmedValues),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    if (result.success) {
      message.success('Registration successful! Please check your email for verification.');
      
      // If verification is not needed (auto-confirmed), try to sign in
      if (!result.needsVerification) {
        // Auto sign-in with Cognito provider
        await signIn('cognito', {
          email: trimmedValues.email,
          callbackUrl: '/dashboard',
        });
      } else {
        // Redirect to verification page or login page
        onNotification('Please check your email and verify your account before signing in.', 'info');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    }
    } catch (error:any) {
      console.error('SignUp error:', error);
      onNotification(error.message || 'An error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleMicrosoftLogin = async () => {
    try {
      setIsMicrosoftLoading(true);
      
      // Get Microsoft OAuth URL from our API
      const response = await fetch('/api/auth/microsoft-oauth');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get Microsoft OAuth URL');
      }
      
      // Redirect directly to Microsoft OAuth
      window.location.href = data.authUrl;
      
    } catch (error: any) {
      console.error('Microsoft login error:', error);
      onNotification('Microsoft login failed. Please try again.', 'error');
      setIsMicrosoftLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      
      // Get Google OAuth URL from our API
      const response = await fetch('/api/auth/google-oauth');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get Google OAuth URL');
      }
      
      // Redirect directly to Google OAuth
      window.location.href = data.authUrl;
      
    } catch (error: any) {
      console.error('Google login error:', error);
      onNotification('Google login failed. Please try again.', 'error');
      setIsGoogleLoading(false);
    }
  };
  return (
    <div className="w-full h-[100vh] landscape:max-lg:h-[auto] flex flex-col align-center justify-center items-center px-[20px] landscape:max-lg:py-[24px] md:px-[0px] bg-[#F5F5F5]">
      <div className="flex flex-col justify-center items-center w-full h-fit md:w-[420px] p-[20px] md:p-[40px] bg-white rounded-[16px]">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className="w-full auth-form"
        >
          <p className="text-black text-[32px] font-[700] text-center leading-[130%]">Sign Up</p>
          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Name"
            name="name"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.trim() === '') {
                    return Promise.reject('Please input your name!');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <BaseInput />
          </Form.Item>
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
                },
              },
            ]}
          >
            <BaseInput />
          </Form.Item>

          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                message:
                  'Password must be at least 6 characters, contain at least one uppercase and one lowercase letter!',
              },
            ]}
          >
            <BaseInput type="password" />
          </Form.Item>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            style={{ position: 'absolute' }}
          />
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password2"
            style={{ position: 'absolute' }}
          />
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
            <BaseInput type="password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: '0px' }}>
            <BaseButton
              customType="primaryActive"
              type="default"
              htmlType="submit"
              block
              loading={isLoading}
            >
              Sign Up
            </BaseButton>
          </Form.Item>
        </Form>
        <Divider className="!my-6">
          <span className="text-gray-500 text-sm">OR</span>
        </Divider>

        <BaseButton
          onClick={handleMicrosoftLogin}
          loading={isMicrosoftLoading}
          type="default"
          block
          className="!bg-white !border !border-gray-300 hover:!bg-gray-50 !h-12 flex items-center justify-center gap-3 mb-3"
        >
          <Image
            src="/assets/icons/microsoft.svg"
            alt="Microsoft"
            width={20}
            height={20}
          />
          <span className="text-gray-700 font-medium">Continue with Microsoft</span>
        </BaseButton>

        <BaseButton
          onClick={handleGoogleLogin}
          loading={isGoogleLoading}
          type="default"
          block
          className="!bg-white !border !border-gray-300 hover:!bg-gray-50 !h-12 flex items-center justify-center gap-3"
        >
          <Image
            src="/assets/icons/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </BaseButton>
      </div>
      <div className="mt-[24px] flex justify-center items-center">
        <span className="text-[16px]">Already have an account?</span>
        <Link style={{ textDecoration: 'underline' }} className="mx-[5px] text-[16px]!" href="/login">
          Log In
        </Link>
      </div>
    </div>
  );
}

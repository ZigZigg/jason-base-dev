'use client';

import BaseButton from '@/app/atomics/button/BaseButton';
import BaseInput from '@/app/atomics/input/BaseInput';
import { Divider, Form, message } from 'antd';
import { signIn } from 'next-auth/react';
// import { useDispatch } from "react-redux";
import Link from 'next/link';
import { useContext, useState } from 'react';
import NotificationContext from '@/app/context/NotificationContext';
import { IconType } from 'antd/es/notification/interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignInMain() {
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
      // Use custom Cognito signin API
      const response = await fetch('/api/auth/cognito-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      if (result.success && result.tokens) {
        // Create NextAuth session using credentials provider with Cognito tokens
        const authResult = await signIn('login', {
          redirect: false,
          email: values.email.trim(),
          cognitoTokens: JSON.stringify(result.tokens),
        });

        if (authResult?.error) {
          throw new Error(authResult.error);
        }

        message.success('Login successful!');
        setTimeout(() => {
          router.push('/subjects');
        }, 1000);
        // Navigation will be handled by useEffect when status changes to 'authenticated'
      } else if (result.challenge) {
        // Handle challenges like MFA, password reset, etc.
        onNotification(`Additional verification required: ${result.challenge}`, 'warning');
      }
    } catch (error:any) {
      console.error('Login error:', error);
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
    <div
      className={`w-full h-[100vh] landscape:max-lg:h-[auto] flex flex-col align-center justify-center items-center px-[20px] landscape:max-lg:py-[24px] md:px-[0px] bg-[#F5F5F5]`}
    >
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
                },
              },
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
                message:
                  'Password must be at least 6 characters, contain at least one uppercase and one lowercase letter!',
              },
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
        <span className="text-[16px]">Don&apos;t have an account?</span>
        <Link
          style={{ textDecoration: 'underline' }}
          className="mx-[5px] text-[16px]!"
          href="/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

'use client';

import BaseButton from '@/app/atomics/button/BaseButton';
import BaseInput from '@/app/atomics/input/BaseInput';
import NotificationContext from '@/app/context/NotificationContext';
import { Form, message } from 'antd';
import { IconType } from 'antd/es/notification/interface';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
export default function SignUpPage() {
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
      const trimmedValues = {
        ...values,
        email: values.email.trim(),
        name: values.name.trim(),
      };

      const result = await signIn('signup', {
        redirect: false,
        ...trimmedValues,
      });

      if (result?.error) {
        onNotification(result?.error, 'error');
      } else {
        message.success('SignUp successful!');
        router.push('/');
      }
    } catch (error) {
      console.error('SignUp error:', error);
      message.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <BaseInput />
          </Form.Item>
          <Form.Item
            style={{ marginTop: '16px', marginBottom: '16px' }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'The input is not valid E-mail!' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  // Trim spaces from start and end before checking
                  const trimmedEmail = value.trim();

                  // Check if there are any spaces in the middle
                  if (trimmedEmail.includes(' ')) {
                    return Promise.reject('The input is not valid E-mail!');
                  }

                  // Validate as standard email
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (emailRegex.test(trimmedEmail)) {
                    return Promise.resolve();
                  }

                  return Promise.reject('The input is not valid E-mail!');
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
      </div>
      <div className="mt-[24px] flex justify-center items-center">
        <span className="text-[16px]">Already have an account?</span>
        <Link style={{ textDecoration: 'underline' }} className="mx-[5px]" href="/login">
          Log In
        </Link>
      </div>
    </div>
  );
}

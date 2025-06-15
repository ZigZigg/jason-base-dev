'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Spin } from 'antd';

function MicrosoftSignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleMicrosoftSignIn = async () => {
      try {
        const email = searchParams.get('email');
        const tokensParam = searchParams.get('tokens');
        const userInfoParam = searchParams.get('userInfo');

        if (!email || !tokensParam || !userInfoParam) {
          throw new Error('Missing authentication parameters. Please try signing in again.');
        }

        // Decode the data
        const tokens = JSON.parse(Buffer.from(tokensParam, 'base64').toString('utf8'));

        // Sign in using NextAuth credentials provider
        const result = await signIn('login', {
          redirect: false,
          email: email,
          cognitoTokens: JSON.stringify(tokens),
        });

        if (result?.error) {
          throw new Error(`Authentication failed: ${result.error}`);
        }

        if (!result?.ok) {
          throw new Error('Authentication was not successful');
        }

        setStatus('success');
        
        // Redirect to dashboard after successful sign-in
        setTimeout(() => {
          router.push('/subjects');
        }, 1000);

      } catch (error: any) {
        console.error('Microsoft sign-in error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'An unexpected error occurred');
        
        // Redirect back to login with error
        setTimeout(() => {
          router.push('/login?error=microsoft_signin_failed');
        }, 3000);
      }
    };

    handleMicrosoftSignIn();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F9FF]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <Spin size="large" />
        <div className="mt-4">
          {status === 'loading' && (
            <p className="text-gray-600">Completing Microsoft sign-in...</p>
          )}
          {status === 'success' && (
            <p className="text-green-600">Sign-in successful! Redirecting...</p>
          )}
          {status === 'error' && (
            <div>
              <p className="text-red-600 mb-2">Sign-in failed</p>
              <p className="text-sm text-gray-500">{errorMessage}</p>
              <p className="text-sm text-gray-400 mt-2">Redirecting back to login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MicrosoftSignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F9FF]">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <Spin size="large" />
          <div className="mt-4">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <MicrosoftSignInContent />
    </Suspense>
  );
} 
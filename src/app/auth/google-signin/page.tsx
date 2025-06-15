'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Spin } from 'antd';

function GoogleSignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      try {
        const email = searchParams.get('email');
        const tokensParam = searchParams.get('tokens');
        const userInfoParam = searchParams.get('userInfo');

        if (!email || !tokensParam || !userInfoParam) {
          throw new Error('Missing required parameters');
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
          throw new Error(result.error);
        }

        setStatus('success');
        
        // Redirect to dashboard after successful sign-in
        setTimeout(() => {
          router.push('/subjects');
        }, 1000);

      } catch (error) {
        console.error('Google sign-in error:', error);
        setStatus('error');
        
        // Redirect back to login with error
        setTimeout(() => {
          router.push('/login?error=google_signin_failed');
        }, 2000);
      }
    };

    handleGoogleSignIn();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F9FF]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <Spin size="large" />
        <div className="mt-4">
          {status === 'loading' && (
            <p className="text-gray-600">Completing Google sign-in...</p>
          )}
          {status === 'success' && (
            <p className="text-green-600">Sign-in successful! Redirecting...</p>
          )}
          {status === 'error' && (
            <p className="text-red-600">Sign-in failed. Redirecting back to login...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoogleSignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F9FF]">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Spin size="large" />
          <div className="mt-4">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <GoogleSignInContent />
    </Suspense>
  );
} 
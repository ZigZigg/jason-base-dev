import { Metadata } from 'next';
import SignInMain from '@/components/Modules/SignInRoot/SignInMain';
export const metadata: Metadata = {
    title: `Log In | Jason Learning`,
    description: 'Log in to your Jason Learning account to access your resources and continue learning.'
};
export default function LoginPage() {

  console.log("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);
  console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL);
  return (
    <SignInMain />
  );
}

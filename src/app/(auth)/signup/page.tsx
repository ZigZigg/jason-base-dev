import SignUpMain from '@/app/components/Modules/SignUpRoot/SignUpMain';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: `Sign Up | Jason Learning`,
    description: 'Create an account to access Jason Learning and start your learning journey.'
};
export default function SignUpPage() {


  return (
    <SignUpMain />
  );
}

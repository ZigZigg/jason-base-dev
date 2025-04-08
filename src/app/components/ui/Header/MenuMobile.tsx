import BaseButton from '@/app/atomics/button/BaseButton';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  setOpenMenuMobile: (value: boolean) => void;
  authStatus: 'loading' | 'unauthenticated' | 'authenticated';
  handleSignOut: () => void;
}

const MenuMobile = (props: Props) => {
  const { setOpenMenuMobile, authStatus, handleSignOut } = props;
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="w-[100%]">
      {authStatus === 'authenticated' && (
        <div className="flex flex-col border-b-[1px] border-[#EAECF0] p-[16px]">
          <BaseButton
            variant="text"
            className="bg-transparent! justify-start! shadow-none! h-[48px] text-[#101828]!"
            onClick={() => {
              setOpenMenuMobile(false);
              router.push('/');
            }}
          >
            Homepage
          </BaseButton>
        </div>
      )}

      <div className="flex flex-col gap-[16px] py-[24px] px-[16px]">
        {authStatus === 'authenticated' ? (
          <BaseButton
            type="default"
            block
            className="h-[48px]!"
            customType={pathname === '/signup' ? 'primaryActive' : undefined}
            onClick={() => {
              setOpenMenuMobile(false);
              handleSignOut();
            }}
          >
            Log out
          </BaseButton>
        ) : (
          <>
            <BaseButton
              type="default"
              block
              className="h-[48px]!"
              customType={pathname === '/signup' ? 'primaryActive' : undefined}
              onClick={() => {
                setOpenMenuMobile(false);
                router.push('/signup');
              }}
            >
              Sign Up
            </BaseButton>
            <BaseButton
              type="default"
              block
              className="h-[48px]!"
              customType={pathname === '/login' ? 'primaryActive' : undefined}
              onClick={() => {
                setOpenMenuMobile(false);
                router.push('/login');
              }}
            >
              Log In
            </BaseButton>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuMobile;

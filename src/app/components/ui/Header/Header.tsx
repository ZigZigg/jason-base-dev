'use client';

import Image from 'next/image';
import BaseButton from '@/app/atomics/button/BaseButton';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Dropdown from 'antd/es/dropdown/dropdown';
import { MenuProps, Popover } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MenuMobile from './MenuMobile';
export default function AppHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [openMenuMobile, setOpenMenuMobile] = useState(false);
  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Sign out without redirecting
    router.push('/login'); // Redirect to the login page after signing out
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={() => handleSignOut()}>Sign out</div>,
    },
  ];

  const renderRightActions = useCallback(() => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <></>
          ) : status === 'unauthenticated' ? (
            renderUnAuthActions()
          ) : (
            renderAuthActions()
          )}
        </div>
        <Popover
          styles={{
            root: {
              width: '100%',
              top: '60px',
            },
            body: {
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              backgroundColor: '#f4f4f4',
              padding: '0px',
            },
          }}
          className="block md:hidden"
          placement="bottom"
          content={<MenuMobile setOpenMenuMobile={setOpenMenuMobile} authStatus={status} handleSignOut={handleSignOut}/>}
          trigger="click"
          arrow={false}
          open={openMenuMobile}
          onOpenChange={(visible) => {
            setOpenMenuMobile(visible);
          }}
        >
          {openMenuMobile ? (
            <Image src="/assets/icon/close.svg" alt="icon-menu" width={20} height={20} />
          ) : (
            <Image src="/assets/icon/menu-bar.svg" alt="icon-menu" width={24} height={24} />
          )}
        </Popover>
      </div>
    );
  }, [session, pathname, status, openMenuMobile]);

  const renderUnAuthActions = useCallback(() => {
    return (
      <>
        <BaseButton
          type="default"
          className="hidden! md:flex!"
          customType={pathname === '/signup' ? 'primaryActive' : undefined}
          onClick={() => {
            router.push('/signup');
          }}
        >
          Sign Up
        </BaseButton>

        <BaseButton
          customType={pathname === '/login' ? 'primaryActive' : undefined}
          type="default"
          className="hidden! md:flex!"
          variant="solid"
          onClick={() => {
            router.push('/login');
          }}
        >
          Log In
        </BaseButton>
      </>
    );
  }, [session, pathname]);

  const renderAuthActions = useCallback(() => {
    return (
      <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
        <div className="flex flex-row items-center gap-[12px] cursor-pointer">
          <Image
            src={session?.user?.avatar || '/default-avatar.png'} // Path to your logo file in the public folder
            alt="Avatar"
            width={40} // Adjust based on your logo's dimensions
            height={40}
            className="rounded-full w-[40px] h-[40px] object-cover"
          />
          <span className="text-[16px] text-[#fff] font-[500] hidden md:block">
            {session?.user?.fullName}
          </span>
          <Image
            className="hidden md:block"
            src="/assets/icon/down.svg" // Path to your logo file in the public folder
            alt="icon-down"
            width={14} // Adjust based on your logo's dimensions
            height={10}
          />
        </div>
      </Dropdown>
    );
  }, [session]);

  return (
    <header className="h-[60px] md:h-[78px] bg-[var(--primary-color)] flex justify-center items-center px-[16px]">
      <div className="flex justify-between items-center h-[100%] w-[100%] xl:w-[1344px] relative">
        <div>
          {status === 'authenticated' && (
            <div className="flex items-center gap-4 hidden md:flex">
              <Link className="text-[16px] font-[400] text-[#fff]!" href="/">
                Homepage
              </Link>
            </div>
          )}
        </div>
        <div className="absolute left-0 -translate-x-0 md:left-1/2 md:-translate-x-1/2">
          <Image
            src="/assets/logo.webp" // Path to your logo file in the public folder
            alt="Logo"
            className="w-[195px] md:w-[270px]"
            width={270} // Adjust based on your logo's dimensions
            height={54}
          />
        </div>
        {renderRightActions()}
      </div>
    </header>
  );
}

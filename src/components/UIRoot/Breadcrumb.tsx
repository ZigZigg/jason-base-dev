'use client';

import React from 'react';
import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { IRoute, systemRoutes } from '@/utils/helpers';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';

interface BreadcrumbItem {
  title: React.ReactElement;
}

const BreadcrumbComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { items: breadcrumbItems } = useBreadcrumb();

  const [items, setItems] = useState<BreadcrumbItem[]>([
    {
      title: <Image src="/assets/icon/home.svg" alt="Home" width={20} height={20} />,
    },
  ]);

  const navigate = (path: string) => {
    const searchParams = window.location.search;
    router.push(`${path}${searchParams || ''}`);
  };

  const createClickableBreadcrumbItem = (title: string, path?: string, isLastItem = false): BreadcrumbItem => ({
    title: (
      <span
        onClick={() => {
          if (path) navigate(path);
        }}
        className={`${isLastItem ? 'text-[#0F72F3]' : 'text-[#475467]'} font-[600] cursor-pointer`}
      >
        {title}
      </span>
    ),
  });

  const createHomeItem = (): BreadcrumbItem => ({
    title: (
      <div onClick={() => navigate('/')} className="cursor-pointer">
        <Image
          id="home-icon"
          src="/assets/icon/home.svg"
          alt="Home"
          width={20}
          height={20}
        />
      </div>
    ),
  });

  useEffect(() => {
    const addItems: BreadcrumbItem[] = [];
    const paths = pathName.split('/').filter((path) => path);

    if (!paths?.length) return;

    const getMatchPaths = (routes: IRoute[], pathIndex: number): void => {
      const route = routes.find((route) => {
        return route.path && route.path.includes(paths[pathIndex]);
      });

      if (!route) return;

      const shouldNavigate = !route.children?.length;
      const navigationPath = shouldNavigate ? route.path! : undefined;
      
      addItems.push(createClickableBreadcrumbItem(route.breadcrumbName, navigationPath));

      if (route?.children?.length) {
        getMatchPaths(route.children, pathIndex + 1);
      }
    };

    getMatchPaths(systemRoutes, 0);

    if (breadcrumbItems?.length) {
      breadcrumbItems.forEach((item, index) => {
        const isLastItem = index === breadcrumbItems.length - 1;
        addItems.push(createClickableBreadcrumbItem(item.title, item.path!, isLastItem));
      });
    }

    setItems([createHomeItem(), ...addItems]);
  }, [pathName, breadcrumbItems]);
  console.log(breadcrumbItems);
  const renderBreadbrumbMobile = () => {
    const title = breadcrumbItems?.length >=2 ? breadcrumbItems[breadcrumbItems.length - 2].title : 'Homepage';
    const path = breadcrumbItems?.length >=2 ? breadcrumbItems[breadcrumbItems.length - 2].path : '/';
    return (
      <div onClick={() => path && navigate(path)} className='flex md:hidden items-center justify-center flex-row gap-[10px] cursor-pointer'>
        <Image src="/assets/icon/up-icon.svg" alt="Home" className='-rotate-90' width={16} height={30} />
        <span className='text-[#667085] text-[14px] font-[400]'>{`Back to ${title}`}</span>
      </div>
    )
  }
  return (
    <>
    {renderBreadbrumbMobile()}
    <Breadcrumb
      className="hidden md:block"
      items={items}
      separator={
        <div className="flex items-center justify-center h-full w-[16px]">
          <Image src="/assets/icon/right-icon.svg" alt="Home" width={6} height={11} />
        </div>
      }
    />
    </>

  );
};

export default BreadcrumbComponent;

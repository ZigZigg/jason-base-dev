'use client';
import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IRoute, systemRoutes } from '@/app/utils/helpers';
import Image from 'next/image';
const BreadcrumbComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const navigate = (path: string) => {
    router.push(path);
  };

  const [items, setItems] = useState([
    {
      title: <Image src="/assets/icon/home.svg" alt="Home" width={20} height={20} />,
    },
  ]);

  useEffect(() => {
    const addItems: any = [];
    const paths = pathName.split('/').filter((path) => path);
    if (!paths?.length) return;
    const getMatchPaths = (routes: IRoute[], pathIndex: number) => {
      const route = routes.find((route) => route.path && route.path.includes(paths[pathIndex]));
      if (!route) return;

      addItems.push({
        title: (
          <span
            onClick={() => {
              if (!route.children?.length) navigate(route.path!);
            }}
            className='text-[#0F72F3] font-[600]'
          >
            {route.breadcrumbName}
          </span>
        ),
      });
      if (route?.children?.length) getMatchPaths(route.children, pathIndex + 1);
    };

    getMatchPaths(systemRoutes, 0);

    setItems([
      {
        title: (
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer"
          >
            <Image 
              id='home-icon' 
              src="/assets/icon/home.svg" 
              alt="Home" 
              width={20} 
              height={20} 
            />
          </div>
        ),
      },
      ...addItems,
    ]);
  }, [pathName]);

  return (
    <Breadcrumb
      className=""
      items={items}
      separator={
        <div className="flex items-center justify-center h-full w-[16px]">
          <Image src="/assets/icon/right-icon.svg" alt="Home" width={6} height={11} />
        </div>
      }
    />
  );
};

export default BreadcrumbComponent;

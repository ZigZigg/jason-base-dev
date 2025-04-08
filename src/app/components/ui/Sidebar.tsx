'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function Sidebar() {
  // Get route path from client
  const pathname = usePathname();
  const menuItems = [
    {
      id: 1,
      title: 'Subjects',
      path: '/subjects',
      icon: (
        <Image src="/assets/category/subject-menu.svg" alt="subject-icon" width={48} height={48} />
      ),
    },
    {
      id: 6,
      title: 'Search',
      path: '/search',
      icon: (
        <Image src="/assets/category/search-menu.svg" alt="subject-icon" width={48} height={48} />
      ),
    },
    {
      id: 2,
      title: 'Grades',
      path: '/grade',
      icon: (
        <Image src="/assets/category/grade-menu.svg" alt="subject-icon" width={48} height={48} />
      ),
    },
    {
      id: 3,
      title: 'Curriculum',
      path: '/curriculum',
      icon: (
        <Image
          src="/assets/category/curriculum-menu.svg"
          alt="subject-icon"
          width={48}
          height={48}
        />
      ),
    },
    {
      id: 4,
      title: 'Learning Path',
      path: '/learning-path',
      icon: (
        <Image src="/assets/category/learning-menu.svg" alt="subject-icon" width={48} height={48} />
      ),
    },
    {
      id: 5,
      title: 'For Fun',
      path: '/for-fun',
      icon: <Image src="/assets/category/fun-menu.svg" alt="subject-icon" width={48} height={48} />,
    },
  ];

  const onChangePath = useCallback((path: string) => {
    window.location.href = path
  },[])

  return (
    <div className="overflow-x-auto md:overflow-x-hidden w-auto md:w-[150px] h-auto md:h-fit rounded-[20px] bg-[#EAF0FC] p-[12px] flex flex-row md:flex-col gap-[12px] rounded-[20px] flex-shrink-0">
      {menuItems.map((item) => {
        return (
          <div
            key={item.id}
            className={`w-fit md:w-full md:aspect-[126/100] rounded-[16px] bg-white ${pathname.includes(item.path) ? 'border-[1px] border-[#0F72F3] opacity-100' : 'opacity-50'}  cursor-pointer flex flex-row md:flex-col items-center justify-center gap-[8px]  md:gap-[4px] py-[9px] px-[12px]`}
            onClick={() => onChangePath(item.path)}
          >
            <div className="w-[20px] h-[20px] md:w-[48px] md:h-[48px]">{item.icon}</div>
            <span className="text-[14px] font-[500] whitespace-nowrap">{item.title}</span>
          </div>
        );
      })}
    </div>
  );
}

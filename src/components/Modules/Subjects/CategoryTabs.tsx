'use client';
import BaseButton from '@/atomics/button/BaseButton';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SubjectData } from '@/lib/modules/subjects/data';
type Props = {
  activeId?: number;
  onTabChange?: (id: number) => void;
  subjects: SubjectData[];
};

const CategoryTabs = ({ activeId, onTabChange, subjects }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentActiveId, setCurrentActiveId] = useState<number>(activeId || 1);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<number, HTMLElement>>(new Map());
  const [isMobile, setIsMobile] = useState(false);

  const allSubjects = useMemo(() => {
    const currentSubject = subjects.filter((subject) => subject.name !== 'CTE');
    return [
      {
        id: 0,
        name: 'All',
        is_top_level: true,
      },
      ...currentSubject,
    ];
  }, [subjects]);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 940);
    };

    // Check on initial load
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Extract ID from path when component mounts or pathname changes
  useEffect(() => {
    if (pathname.startsWith('/subjects/')) {
      const pathId = Number(pathname.split('/').pop());
      if (!isNaN(pathId) && pathId > 0) {
        setCurrentActiveId(pathId);
      }
    }
  }, [pathname]);

  // Scroll to active tab when ID changes (only on mobile)
  useEffect(() => {
    if (isMobile && tabsContainerRef.current && buttonRefs.current.has(currentActiveId)) {
      const button = buttonRefs.current.get(currentActiveId);
      if (button) {
        // Get the container's scroll position and dimensions
        const container = tabsContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Calculate the center position
        const buttonCenter = buttonRect.left + buttonRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const scrollOffset = buttonCenter - containerCenter;

        // Scroll the container
        container.scrollBy({
          left: scrollOffset,
          behavior: 'smooth',
        });
      }
    }
  }, [currentActiveId, isMobile]);

  const handleTabClick = (id: number) => {
    setCurrentActiveId(id);
    if (onTabChange) {
      onTabChange(id);
    } else {
      // Default behavior: navigate to subject detail
      router.push(`/subjects/${id}`);
    }
  };

  return (
    <div
      ref={tabsContainerRef}
      className="w-full flex flex-row items-center overflow-x-auto h-fit scrollbar-hide"
    >
      {allSubjects.map((subject) => {
        const isActive = subject.id === (activeId === 0 ? 0 : activeId || currentActiveId);

        return (
          <div
            key={subject.id}
            ref={(el) => {
              if (el) {
                buttonRefs.current.set(subject.id, el);
              }
            }}
          >
            <BaseButton
              type={isActive ? 'primary' : 'text'}
              variant="text"
              id={String(subject.id)}
              className="h-[48px]! text-[16px] font-[400] text-[#182230] rounded-[12px] px-[12px]! whitespace-nowrap"
              onClick={() => handleTabClick(subject.id)}
            >
              {subject.name}
            </BaseButton>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryTabs;

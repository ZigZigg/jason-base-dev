'use client';

import { Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const itemSortBy: MenuProps['items'] = [
  {
    label: 'Title - A to Z',
    key: 'title:asc',
  },
  {
    label: 'Title - Z to A',
    key: 'title:desc',
  },
  {
    label: 'Created At - Newest',
    key: 'created_at:desc',
  },
  {
    label: 'Created At - Oldest',
    key: 'created_at:asc',
  },
];

// Map sort keys to their display labels
const sortLabels: Record<string, string> = {
  'title:asc': 'Title - A to Z',
  'title:desc': 'Title - Z to A',
  'created_at:desc': 'Created At - Newest',
  'created_at:asc': 'Created At - Oldest',
};

// Default sort option
const DEFAULT_SORT = 'created_at:desc';

type Props = {
  count: number;
}

const FilteringSubject = ({ count }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSort, setCurrentSort] = useState<string>(DEFAULT_SORT);
  
  // Initialize sort from URL params or use default
  useEffect(() => {
    const sortParam = searchParams.get('sort_by');
    if (sortParam && Object.keys(sortLabels).includes(sortParam)) {
      setCurrentSort(sortParam);
    } else {
      setCurrentSort(DEFAULT_SORT);
    }
  }, [searchParams]);

  // Handle sort change
  const handleSortChange = ({ key }: { key: string }) => {
    if (key === currentSort) return;
    
    // Create new URL with updated sort parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort_by', key);
    
    // Update the URL
    router.push(`?${params.toString()}`);
    setCurrentSort(key);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full mb-[24px]">
      <span className="text-[14px] md:text-[16px] font-[400] text-[#667085]">
        {`${count} resources about this topic`}
      </span>
      <div className="flex flex-row gap-[12px] md:gap-[40px] items-center">
        <div className="flex flex-row gap-[4px] items-center">
          <Dropdown 
            menu={{ 
              items: itemSortBy, 
              selectedKeys: [currentSort],
              onClick: handleSortChange 
            }} 
            trigger={['click']} 
            className="cursor-pointer"
          >
            <div className="flex items-center gap-[4px]">
              <span className="text-[14px] md:text-[16px] font-[400] text-[#667085]">Sort by:</span>
              <span id="sort-by" className="text-[16px] font-[700] text-[#000000] hidden md:block">
                {sortLabels[currentSort]}
              </span>
              <Image src="/assets/icon/down-fill.svg" alt="Sort Icon" width={10} height={6} />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default FilteringSubject;

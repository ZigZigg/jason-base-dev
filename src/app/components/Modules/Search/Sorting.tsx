"use client";
import { MenuProps } from 'antd';
import Dropdown from 'antd/es/dropdown/dropdown';
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

interface SearchSortingProps {
  total: number;
}

const SearchSorting = ({ total = 0 }: SearchSortingProps) => {
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
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row gap-[4px] items-center">
        <span className="text-[14px] md:text-[16px] font-[400] text-[#0F72F3]">{total}</span>
        <span className="text-[14px] md:text-[16px] font-[400] text-[#667085]">
          {total === 1 ? 'collection found' : 'collections found'}
        </span>
      </div>

      <div className="flex flex-row gap-[12px] md:gap-[40px] items-center">
        <div className="flex flex-row gap-[8px] items-center">
          <Dropdown 
            menu={{ 
              items: itemSortBy, 
              selectedKeys: [currentSort],
              onClick: handleSortChange 
            }} 
            trigger={['click']} 
            className="cursor-pointer"
          >
            <div className="flex items-center gap-[8px]">
              <Image src="/assets/icon/filter.svg" alt="Sort Icon" width={19} height={17} />
              <span className="text-[16px] md:text-[16px] font-[400] text-[#666666]">Sort by:</span>
              <span id="sort-by" className="text-[16px] font-[500] text-[#0F72F3] hidden md:block">
                {sortLabels[currentSort]}
              </span>
              <Image className='rotate-180' src="/assets/icon/up-icon.svg" alt="Up Icon" width={10} height={6} />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default SearchSorting;

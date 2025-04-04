"use client";
import { MenuProps } from 'antd';
import Dropdown from 'antd/es/dropdown/dropdown';
import Image from 'next/image';
import React from 'react';

const itemSortBy: MenuProps['items'] = [
  {
    label: 'Most relevant',
    key: 'relevance',
  },
  {
    label: 'Newest first',
    key: 'newest',
  },
  {
    label: 'Oldest first',
    key: 'oldest',
  },
];

interface SearchSortingProps {
  total: number;
}

const SearchSorting = ({ total = 0 }: SearchSortingProps) => {
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
          <Dropdown menu={{ items: itemSortBy }} trigger={['click']} className="cursor-pointer">
            <div className="flex items-center gap-[8px]">
              <Image src="/assets/icon/filter.svg" alt="Sort Icon" width={19} height={17} />
              <span className="text-[16px] md:text-[16px] font-[400] text-[#666666]">Sort by:</span>
              <span className="text-[16px] font-[700] text-[#0F72F3] hidden md:block">
                Most relevant
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

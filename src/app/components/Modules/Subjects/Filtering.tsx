import { Dropdown, MenuProps } from 'antd';
import Image from 'next/image';
import React from 'react';

const itemSortBy: MenuProps['items'] = [
  {
    label: 'Sort by 01',
    key: '0',
  },
  {
    label: 'Sort by 02',
    key: '1',
  },
  {
    label: 'Sort by 03',
    key: '2',
  },
];
const FilteringSubject = () => {
  return (
    <div className="flex flex-row items-center justify-between w-full mb-[24px]">
      <span className="text-[14px] md:text-[16px] font-[400] text-[#667085]">
        1235 videos about this topic
      </span>
      <div className="flex flex-row gap-[12px] md:gap-[40px] items-center">
        <div className="flex flex-row gap-[4px] items-center">
          <Dropdown menu={{ items: itemSortBy }} trigger={['click']} className="cursor-pointer">
            <div className="flex items-center gap-[4px]">
              <span className="text-[14px] md:text-[16px] font-[400] text-[#667085]">Sort by:</span>
              <span className="text-[16px] font-[700] text-[#000000] hidden md:block">
                Most relevant
              </span>
              <Image src="/assets/icon/down-fill.svg" alt="Subject Icon" width={10} height={6} />
            </div>
          </Dropdown>
        </div>
        {/* <div className="flex flex-row gap-[4px] items-center">
          <Dropdown menu={{ items: itemSortBy }} trigger={['click']} className="cursor-pointer">
            <div className="flex items-center gap-[4px]">
              <span className="text-[14px] md:text-[16px] font-[400] text-[#667085]">
                Filter by:
              </span>
              <span className="text-[16px] font-[700] text-[#000000] hidden md:block">
                Infants and Toddlers
              </span>
              <Image src="/assets/icon/down-fill.svg" alt="Subject Icon" width={10} height={6} />
            </div>
          </Dropdown>
        </div> */}
      </div>
    </div>
  );
};

export default FilteringSubject;

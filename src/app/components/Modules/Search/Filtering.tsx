'use client'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import Image from 'next/image'
import { Popover } from 'antd'
import { SearchParams } from '@/app/lib/interfaces/search'

const SearchFilteringContent = dynamic(() => import('./SearchFilteringContent'), {
  ssr: false,
})

interface SearchFilteringProps {
  initialParams?: SearchParams;
}

const SearchFiltering = ({ initialParams }: SearchFilteringProps) => {
  const [openFilterMobile, setOpenFilterMobile] = useState(false);

  return (
    <div className='w-full md:w-[1416px] px-[16px] md:px-[0px] pb-[24px] md:pb-[0px]'>
      <Popover 
          styles={{
            root: {
              width: '100%',
              top: '162px',
            },
            body: {
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              padding: '0px',
              boxShadow: 'rgba(0, 0, 0, 0.08) 0px 30px 13px 0px, rgba(0, 0, 0, 0.12) 0px 10px 6px 1px',
            },
          }}
          className="block md:hidden"
          placement="bottom"
          content={<SearchFilteringContent initialParams={initialParams} onSearch={() => {setOpenFilterMobile(false)}} />}
          trigger="click"
          arrow={false}
          open={openFilterMobile}
          onOpenChange={(visible) => {
            setOpenFilterMobile(visible);
          }}
      >
        <div className='flex flex-row justify-between items-center w-full'>
          <span className='text-[#667085] text-[16px] font-[600]'>Search fields</span>
          <Image className={`${openFilterMobile ? 'rotate-180' : ''}`} src='/assets/icon/up-icon.svg' alt='Dropdown' width={12} height={8}/>
        </div>
      </Popover>

      <div className='hidden md:block'>
        <SearchFilteringContent initialParams={initialParams} />
      </div>

    </div>
  )
}

export default SearchFiltering
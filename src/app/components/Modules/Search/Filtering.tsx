'use client'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Popover } from 'antd'
import { SearchParams } from '@/app/lib/interfaces/search'
import { useOrientation } from '@/app/providers/OrientationProvider'
import { useSearchParams } from 'next/navigation'

const SearchFilteringContent = dynamic(() => import('./SearchFilteringContent'), {
  ssr: false,
})

interface SearchFilteringProps {
  initialParams?: SearchParams;
}

const SearchFiltering = ({ initialParams }: SearchFilteringProps) => {
  const [openFilterMobile, setOpenFilterMobile] = useState(false);
  const orientation = useOrientation();
  const searchParams = useSearchParams();

  const clientInitialParams = useMemo(() => {
    // Use provided initialParams if available, otherwise create from URL params
    if (initialParams) return initialParams;

    // Parse client-side search params with the same structure as server-side
    return {
      search_text: searchParams.get('search_text') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 10,
      sort_by: searchParams.get('sort_by') || 'created_at:desc',
      grades: Array.isArray(searchParams.getAll('grades[]'))
        ? searchParams.getAll('grades[]')
        : searchParams.get('grades[]')
        ? [searchParams.get('grades[]') as string]
        : [],
      subjects: Array.isArray(searchParams.getAll('subjects[]'))
        ? searchParams.getAll('subjects[]')
        : searchParams.get('subjects[]')
        ? [searchParams.get('subjects[]') as string]
        : [],
    } as SearchParams;
  }, [initialParams, searchParams]);

  useEffect(() => {
    if(orientation.isLandscape) {
      setOpenFilterMobile(false);
    }
  },[orientation])
  
  return (
    <div className='w-full xl:w-[1416px] px-[16px] xl:px-[0px] pb-[24px] md:pb-[0px]'>
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
          content={<SearchFilteringContent initialParams={clientInitialParams} onSearch={() => {setOpenFilterMobile(false)}} />}
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
        <SearchFilteringContent initialParams={clientInitialParams} />
      </div>

    </div>
  )
}

export default SearchFiltering
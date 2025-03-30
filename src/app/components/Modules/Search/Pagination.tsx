"use client"
import React from 'react'
import { Pagination, PaginationProps } from 'antd';
import Image from 'next/image';
import styles from './Search.module.scss'
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
}

const SearchPagination = ({ currentPage, totalItems, pageSize }: SearchPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Page change handler that updates URL
  const handlePageChange = (page: number) => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update the page parameter
    params.set('page', page.toString());
    
    // Navigate to the new URL
    router.push(`/search?${params.toString()}`);
  };

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <div className='absolute left-[0px] flex items-center gap-[10px]'>
        <Image src='/assets/icon/arrow-left.svg' alt='Previous' width={12} height={12} />
        <span className='text-[14px] font-[600] text-[#344054]'>Previous</span>
      </div>;
    }
    if (type === 'next') {
      return <div className='absolute right-[0px] flex items-center gap-[10px]'>
        <span className='text-[14px] font-[600] text-[#344054]'>Next</span>
        <Image src='/assets/icon/arrow-left.svg' className='rotate-180' alt='Next' width={12} height={12} />
      </div>;
    }
    return originalElement;
  };

  return (
    <div className='w-full h-auto flex justify-between items-center pt-[20px] border-t-[1px] border-[#EAECF0]'>
        <div className={`${styles.pagination} w-full flex justify-center items-center relative`}>
            <Pagination 
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              showSizeChanger={false}
              itemRender={itemRender}
              onChange={handlePageChange}
              hideOnSinglePage
              showLessItems
            />
        </div>
    </div>
  )
}

export default SearchPagination
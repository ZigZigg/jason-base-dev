"use client"
import React from 'react'
import { Pagination, PaginationProps } from 'antd';
import Image from 'next/image';
import styles from './Search.module.scss'

const SearchPagination = () => {
    const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
        if (type === 'prev') {
          return <div className='absolute left-[0px] flex items-center gap-[10px]'>
            <Image src='/assets/icon/arrow-left.svg' alt='Arrow Left' width={12} height={12} />
            <span className='text-[14px] font-[600] text-[#344054]'>Previous</span>
          </div>;
        }
        if (type === 'next') {
          return <div className='absolute right-[0px] flex items-center gap-[10px]'>
            <span className='text-[14px] font-[600] text-[#344054]'>Next</span>
            <Image src='/assets/icon/arrow-left.svg' className='rotate-180' alt='Arrow Left' width={12} height={12} />

          </div>;
        }
        return originalElement;
      };
  return (
    <div className='w-full h-auto flex justify-between items-center pt-[20px] border-t-[1px] border-[#EAECF0]'>
        <div className={`${styles.pagination} w-full flex justify-center items-center relative`}>
            <Pagination  defaultCurrent={1} total={100} showSizeChanger={false} itemRender={itemRender} align='center' />
        </div>
    </div>
  )
}

export default SearchPagination
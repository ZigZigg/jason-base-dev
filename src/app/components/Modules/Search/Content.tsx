"use client";
import React from 'react'
import SearchSorting from './Sorting'
import SearchContentItem from './ContentItem'
import SearchPagination from './Pagination'
import { SearchResponse } from '@/app/lib/interfaces/search'
import Image from 'next/image';

interface SearchContentProps {
  searchResults: SearchResponse;
}

const SearchContent = ({ searchResults }: SearchContentProps) => {
  const { results, current_page, per_page, total } = searchResults;
  const hasResults = results && results.length > 0;

  return (
    <div className='w-[1416px] h-auto flex flex-col justify-center items-center py-[32px] px-[16px] md:px-[0px]'>
      {hasResults && <SearchSorting total={total} />}
        
        
        {hasResults ? (
          <div className='flex flex-col py-[24px] gap-[24px] w-full'>
            {results.map((item, index) => (
              <SearchContentItem key={item.id || index} item={item} />
            ))}
          </div>
        ) : (
          <div className='w-full flex flex-col items-center justify-center'>
            <div className='w-[350px] h-[350px] md:h-[600px] flex flex-col items-center justify-center'>
              <Image src="/assets/search/empty.svg" alt="empty-state" width={350} height={229} />
              <p className='text-[#667085] text-[16px] font-[500] mt-[24px]'>Start to lookup! Type something.</p>
            </div>
          </div>
        )}
        
        {hasResults && total > per_page && (
          <SearchPagination 
            currentPage={current_page} 
            totalItems={total} 
            pageSize={per_page} 
          />
        )}
    </div>
  )
}

export default SearchContent
import SearchContent from '@/app/components/Modules/Search/Content'
import SearchFiltering from '@/app/components/Modules/Search/Filtering'
import React from 'react'


const SearchPage = () => {
  return (
    <div className='w-full h-auto flex flex-col justify-center items-center'>
        <SearchFiltering />
        <div className='w-full h-auto flex justify-center items-center bg-[#F5F5F2]'>
            <SearchContent />
        </div>
    </div>
  )
}

export default SearchPage
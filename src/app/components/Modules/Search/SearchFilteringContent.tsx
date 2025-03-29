import BaseButton from '@/app/atomics/button/BaseButton'
import BaseSearchBar from '@/app/atomics/input/BaseSearchBar'
import SelectBox from '@/app/atomics/select/SelectBox'
import React from 'react'

const SearchFilteringContent = () => {
  return (
    <div className='flex flex-col md:flex-row md:w-[1416px] gap-[20px] mb-[24px] px-[16px] md:px-[0px] pb-[24px] md:pb-[0px]'>
        <div className='flex flex-col gap-[4px] flex-1'>
            <span className='text-[#667085] text-[16px] font-[500]'>Text Search</span>
            <BaseSearchBar />
        </div>
        <div className='flex flex-col gap-[4px] w-full md:w-[250px] flex-shrink-0'>
            <span className='text-[#667085] text-[16px] font-[500]'>Grades</span>
            <SelectBox placeholder='Select Grade(s)' />
        </div>
        <div className='flex flex-col gap-[4px] w-full md:w-[250px] flex-shrink-0'>
            <span className='text-[#667085] text-[16px] font-[500]'>Subjects</span>
            <SelectBox placeholder='Select Subject(s)' />
        </div>
        <div className='flex items-end flex-shrink-0'>
        <BaseButton
          type="default"
          className="md:flex! h-[56px]! w-full! md:w-auto!"
          customType='primaryActive'
          onClick={() => {

          }}
        >
          Submit
        </BaseButton>
        </div>

    </div>
  )
}

export default SearchFilteringContent
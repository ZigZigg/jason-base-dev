import React from 'react'
import SearchSorting from './Sorting'
import SearchContentItem from './ContentItem'
import SearchPagination from './Pagination'


const mockData = [
    {
        id: 1,
        module: 'Playwatch Kids Math',
        thumbnail: 'https://assets.jason.org/resource_assets/57539/37360/PlaywatchBrainBreaks_Thumb%20copy.png',
        shortDesc: 'Counting, addition, and shapes: Playwatch Kids Math helps build familiarity and fun with mathematics. Enjoy exploring the videos shared in this module.',
        grades:['K-2', '3-5', '6-8'],
        subjects:['Math'],
    },
    {
        id: 2,
        module: 'Immersion Learning | Ocean, STEAM, Social Studies',
        thumbnail: 'https://assets.jason.org/resource_assets/57668/37411/People_Difference_Thumbnail_Large.png',
        shortDesc: 'Immersion Learning is a collection of 8 Adventure Series designed to help youth succeed in science, math, and literacy while using technology and engineering to explore real-world phenomena.',
        grades:['K-2', '3-5', '6-8', '9-12'],
        subjects:['Science', 'Math', 'Social Studies'],
    },
    {
        id: 3,
        module: 'World Of Waves | Water, Sound, Light, Electromagnetic',
        thumbnail: 'https://assets.jason.org/resource_assets/53704/32740/LEVL_Playwatch_Thumb.png',
        shortDesc: 'World of Waves is a collection of 8 Adventure Series designed to help youth succeed in science, math, and literacy while using technology and engineering to explore real-world phenomena.',
        grades:['K-2', '3-5', '6-8', '9-12'],
        subjects:['Science', 'Math', 'Social Studies'],
    }
]
const SearchContent = () => {
  return (
    <div className='w-[1416px] h-auto flex flex-col justify-center items-center py-[32px] px-[16px] md:px-[0px]'>
        <SearchSorting />
        <div className='flex flex-col py-[24px] gap-[24px]'>
            {
                mockData.map((item, index) => {
                    return <SearchContentItem key={index} item={item} />
                })
            }
        </div>
        <SearchPagination />
    </div>
  )
}

export default SearchContent
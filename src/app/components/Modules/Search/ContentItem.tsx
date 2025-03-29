import Image from 'next/image'
import React from 'react'


type Props = {
    item: {
        id: number,
        module: string,
        thumbnail: string,
        shortDesc: string,
        grades: string[],
        subjects: string[]
    }
}

const SearchContentItem = (props: Props) => {
    const {item} = props
  return (
    <div className='w-full h-auto rounded-[8px] bg-[#FFFFFF] flex flex-col'>
        <div className='block w-full bg-[#DDE7F9] py-[10px] px-[16px] rounded-t-[8px]'>
            <span className='text-[16px] md:text-[18px] font-[600] text-[#0F72F3]'>{item.module}</span>
        </div>
        <div className='w-full p-[24px] flex flex-col md:flex-row gap-[16px] md:gap-[30px]'>
            <Image
                src={item.thumbnail} // Replace with your image path
                alt="Video Image"
                width={232}
                height={132}
                sizes="(max-width: 768px) 311px, 232px"
                className="rounded-[8px] flex-shrink-0 w-full md:w-[232px] aspect-[311/178] md:aspect-[232/132]"
                loading="lazy" // Lazy load the image
            />
            <div className='flex flex-1 flex-col gap-[12px]'>
                <span className='text-[14px] md:text-[16px] font-[400] text-[#667085]'>{item.shortDesc}</span>
                <div className='w-full h-[1px] bg-[#EAECF0]'></div>
                <div className='flex flex-row gap-[12px] items-center'>
                    <Image src='/assets/icon/group.svg' alt='Grade Icon' width={18} height={18}/>
                    <span className='text-[#475467] font-[700] text-[14px] md:text-[16px]'>Grades:</span>
                    <span className='text-[#475467] font-[400] text-[14px] md:text-[16px]'>{item.grades.join(',')}</span>
                </div>
                <div className='flex flex-row gap-[12px] items-center'>
                    <Image src='/assets/icon/subject-icon.svg' alt='Grade Icon' width={18} height={18}/>
                    <span className='text-[#475467] font-[700] text-[14px] md:text-[16px]'>Subjects:</span>
                    <span className='text-[#475467] font-[400] text-[14px] md:text-[16px]'>{item.subjects.join(',')}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SearchContentItem
'use client'
import { SearchResource } from '@/app/lib/interfaces/search'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'


type Props = {
    item: SearchResource
}

const SearchContentItem = (props: Props) => {
    const {item} = props
    const [isExpanded, setIsExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const descriptionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const checkOverflow = () => {
            const element = descriptionRef.current
            if (element) {
                // Check if the content is overflowing by comparing scrollHeight to clientHeight
                const isTextOverflowing = element.scrollHeight > element.clientHeight
                setIsOverflowing(isTextOverflowing)
            }
        }
        
        checkOverflow()
        
        // Add resize listener to recheck when window resizes
        window.addEventListener('resize', checkOverflow)
        return () => window.removeEventListener('resize', checkOverflow)
    }, [])

    const toggleDescription = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsExpanded(!isExpanded)
    }

  return (
    <Link href={`/resource/${item.id}?parentSubjectId=0&parentSubjectName=Search`} className='w-full h-auto rounded-[8px] bg-[#FFFFFF] flex flex-col'>
        <div className='block w-full bg-[#DDE7F9] py-[10px] px-[16px] rounded-t-[8px]'>
            <span className='text-[16px] md:text-[18px] font-[600] text-[#0F72F3]'>{item.title}</span>
        </div>
        <div className='w-full p-[24px] flex flex-col md:flex-row gap-[16px] md:gap-[30px]'>
            <div className="w-full md:w-[232px] md:h-[132px] md:flex-none flex-shrink-0">
                <Image
                    id='resource-image'
                    src={item.thumbnail || '/assets/resource-default.webp'} // Replace with your image path
                    alt="Video Image"
                    width={232}
                    height={132}
                    sizes="(max-width: 768px) 100vw, 232px"
                    className="rounded-[8px] w-full h-auto md:w-[232px] md:h-[132px] object-cover"
                    loading="lazy" // Lazy load the image
                />
            </div>
            <div className='flex flex-1 flex-col gap-[12px] min-w-0'>
                <div className='relative'>
                    <div 
                        id='description' 
                        ref={descriptionRef}
                        className={`text-[14px] md:text-[16px] font-[400] text-[#667085] ${!isExpanded ? 'line-clamp-2' : ''}`}
                    >
                        {item.description}
                    </div>
                    {(isOverflowing || isExpanded) && (
                        <button 
                            id='show-more-button'
                            onClick={toggleDescription} 
                            className="text-[#0F72F3] font-[500] text-[14px] ml-1 mt-1 hover:underline"
                        >
                            {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>
                <div className='w-full h-[1px] bg-[#EAECF0]'></div>
                <div className='flex flex-row gap-[12px] items-center flex-wrap'>
                    <Image src='/assets/icon/group.svg' alt='Grade Icon' width={18} height={18} className="flex-shrink-0" />
                    <span className='text-[#475467] font-[700] text-[14px] md:text-[16px] flex-shrink-0'>Grades:</span>
                    <span className='text-[#475467] font-[400] text-[14px] md:text-[16px] break-words'>{item.grades.map(grade => grade.name).join(', ')}</span>
                </div>
                <div className='flex flex-row gap-[12px] items-start flex-wrap'>
                    <Image className='w-[18px] h-[18px] flex-shrink-0 mt-[3px]' src='/assets/icon/subject-icon.svg' alt='Subject Icon' width={18} height={18}/>
                    <span className='text-[#475467] font-[700] text-[14px] md:text-[16px] flex-shrink-0'>Subjects:</span>
                    <span id='subject-name' className='text-[#475467] font-[400] text-[14px] md:text-[16px] break-words'>{item.subjects.map(subject => subject.name).join(', ')}</span>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default SearchContentItem
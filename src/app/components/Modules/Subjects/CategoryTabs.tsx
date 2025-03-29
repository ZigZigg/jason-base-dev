"use client"
import BaseButton from '@/app/atomics/button/BaseButton'
import React, { useEffect, useState } from 'react'
import { subjectData } from './subjectData'
import { useRouter, usePathname } from 'next/navigation'

type Props = {
  activeId?: number;
  onTabChange?: (id: number) => void;
}

const CategoryTabs = ({ activeId, onTabChange }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const [currentActiveId, setCurrentActiveId] = useState<number>(activeId || 1)
  
  // Extract ID from path when component mounts or pathname changes
  useEffect(() => {
    if (pathname.startsWith('/subjects/')) {
      const pathId = Number(pathname.split('/').pop())
      if (!isNaN(pathId) && pathId > 0) {
        setCurrentActiveId(pathId)
      }
    }
  }, [pathname])
  
  const handleTabClick = (id: number) => {
    setCurrentActiveId(id)
    if (onTabChange) {
      onTabChange(id)
    } else {
      // Default behavior: navigate to subject detail
      router.push(`/subjects/${id}`)
    }
  }

  return (
    <div className='w-full flex flex-row items-center overflow-x-auto h-fit'>
        {
            subjectData.map((subject) => {
                const isActive = subject.id === (activeId || currentActiveId)
                return (
                    <BaseButton 
                      type={isActive ? 'primary' : 'text'} 
                      variant='text' 
                      key={subject.id} 
                      className='h-[48px]! text-[16px] font-[400] text-[#182230] rounded-[12px] px-[12px]! whitespace-nowrap'
                      onClick={() => handleTabClick(subject.id)}
                    >
                        {subject.label}
                    </BaseButton>
                )
            })
        }
    </div>
  )
}

export default CategoryTabs
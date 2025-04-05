import BreadcrumbComponent from '@/app/components/ui/Breadcrumb'
import React from 'react'


const NoneDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <div className="w-[100% h-auto flex flex-col justify-center items-start xl:items-center md:flex-col gap-[16px] md:gap-[24px] pt-[16px] md:pt-[24px] md:px-[0px]">
        <div className='xl:w-[1416px] h-auto px-[16px] xl:px-[0px]'>
            <BreadcrumbComponent />
        </div>
        {children}
      </div>
  )
}

export default NoneDashboardLayout
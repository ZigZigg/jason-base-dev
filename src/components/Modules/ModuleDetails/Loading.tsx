'use client';

import { Skeleton } from 'antd'
import React from 'react'


const LoadingResourceDetail = () => {
  return (
    <div className='flex flex-col gap-[40px] w-full'>
        <div id="video-player" className="flex-1 flex flex-col">
            <Skeleton.Node
                active
                className="rounded-[8px] !w-full !h-[480px]"
            />
        </div>
        <div className="flex flex-col py-[24px] gap-[24px] w-full">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="w-full h-auto rounded-[8px] flex flex-col">
            <div className="w-full p-[24px] flex flex-col md:flex-row gap-[16px] md:gap-[30px]">
              <div className="flex flex-1 flex-col gap-[12px] min-w-0">
                <Skeleton active />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoadingResourceDetail
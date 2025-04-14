'use client';

import { Skeleton } from 'antd'
import Image from 'next/image'
import React from 'react'


const LoadingResourceDetail = () => {
  return (
    <>
        <div className="w-full md:w-[320px] order-1 md:order-2 z-10">
            <div className={`w-full md:w-[320px] md:h-fit border-[#0F72F3] md:border-[#F2F4F7] border rounded-[12px] flex flex-col px-[16px] pt-[0px] gap-[4px] md:relative md:rounded-b-[12px]`}>
                <div className={`w-full h-[66px] border-b-[#fff] md:border-b-[#EAECF0] border-b-[2px] flex flex-row items-center justify-between cursor-pointer bg-white rounded-t-[12px] z-10`}>
                    <span className="text-[16px] font-[700] text-[#475467]">Playwatch Videos</span>
                    <Image
                        className={`block md:hidden transition-transform duration-300`}
                        src="/assets/icon/chevron-down.svg"
                        alt="Toggle videos"
                        width={16}
                        height={16}
                    />
                </div>
                <div className="flex flex-col overflow-y-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0 invisible md:max-h-[532px] md:opacity-100 md:visible">
                    {
                        [...Array(4)].map((_, index) => (
                            <div key={index} className="w-full h-auto  flex flex-row items-center justify-between cursor-pointer bg-white rounded-t-[12px] z-10 mb-4">
                                <Skeleton
                                    active
                                    className="rounded-[8px]"
                                />
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
        <div id="video-player" className="flex-1 flex flex-col order-2 md:order-1 z-0">
                <Skeleton.Node
                    active
                    className="rounded-[8px] !w-full !h-[480px]"
                />
            </div>
    </>
  )
}

export default LoadingResourceDetail
'use client';
import React from 'react';
import { Skeleton } from 'antd';



const LoadingSearch = () => {
  return (
    <div className="xl:w-[1280px] h-auto flex flex-col justify-center items-center py-[32px] px-[16px] xl:px-[0px]">
      {/* Generate 4 skeleton items */}
      <div className="flex flex-col py-[24px] gap-[24px] w-full">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="w-full h-auto rounded-[8px] flex flex-col">
            <div className="w-full p-[24px] flex flex-col md:flex-row gap-[16px] md:gap-[30px]">
              <div className="w-full md:w-[232px] md:h-[132px] md:flex-none flex-shrink-0">
                <Skeleton.Node
                  active
                  className="rounded-[8px] w-full! h-auto! md:w-[232px]! md:h-[132px]! object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-[12px] min-w-0">
                <Skeleton active />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSearch;

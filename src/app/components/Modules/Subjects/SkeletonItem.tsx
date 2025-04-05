'use client';

import React from 'react';

const SkeletonItem = () => {
  return (
    <div className="w-full rounded-[16px] md:rounded-[24px] flex flex-col animate-pulse">
      {/* Skeleton for image */}
      <div className="w-full aspect-[343/170] md:aspect-[276/170] rounded-[16px] bg-gray-200" />
      
      {/* Skeleton for title */}
      <div className="mt-[12px] flex flex-col gap-[4px]">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonItem;

export const SubjectSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 md:gap-x-[32px] gap-y-[24px] md:gap-y-[24px]">
      {Array(8).fill(0).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
}; 
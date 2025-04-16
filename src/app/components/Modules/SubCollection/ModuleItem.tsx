'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionResponseType, SubCollectionItem } from '@/app/lib/modules/resource/data';

interface ModuleItemProps {
  item: SubCollectionItem;
  type: CollectionResponseType
}

const ModuleItem = ({
  item,
  type
}: ModuleItemProps) => {
  const { title, description, thumbnail } = item;
  return (
    <div className="flex flex-col sm:flex-row gap-[14px] md:gap-[30px] w-full">
      {/* Thumbnail */}
      <div className="relative w-full md:w-[232px] h-[204px] md:h-[138px] shrink-0">
        {/* Shadow Layer 2 (lop 2) */}
        <div className="w-[95%] absolute inset-0 bg-black/10 rounded-[4px] translate-x-[6px] translate-y-[-6px] z-1"></div>
        
        {/* Shadow Layer 1 (lop 1) */}
        <div className="w-[97%] absolute inset-0 bg-black/20 rounded-[4px] translate-x-[4px] translate-y-[-3px] z-2"></div>
        
        {/* Main Image */}
        <div className="absolute inset-0 rounded-[4px] overflow-hidden z-3 aspect-[343/204] md:aspect-[232/138]">
          <Image  
            src={thumbnail || '/assets/subject-category.webp'} 
            alt={title || 'Module Thumbnail'}
            fill
            className="object-cover aspect-[343/204] md:aspect-[232/138]" 
          />
        </div>
        
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-[8px] flex-grow">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col">
            <h3 className="text-[18px] font-medium text-black">{title}</h3>
            {
              type === 'SUB_COLLECTION' ? <span className="text-[#0F72F3] text-[14px] font-medium">{type === 'SUB_COLLECTION' ? 'Module' : title}</span> : <div className='flex flex-row gap-[4px] rounded-[4px] p-[4px] bg-[#EAF0FC]'>
                <Image src="/assets/subcollection/resource-icon.svg" alt="resource-icon" width={16} height={16} />
                <span className="text-[#0F72F3] text-[12px] font-[600]">{title}</span>
              </div>
            }
            
            
          </div>
        </div>
        <p className="text-[#667085] text-[14px] md:text-[16px] line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default ModuleItem; 
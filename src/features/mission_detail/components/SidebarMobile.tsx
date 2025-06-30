'use client';

import { ResourceCollectionResponse } from '@/lib/interfaces/resource';
import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  collections: ResourceCollectionResponse[];
  selectedCollectionIndex: number;
  onCollectionSelect: (collectionIndex: number) => void;
};

const SidebarMobile = ({ collections, selectedCollectionIndex, onCollectionSelect }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full border border-[#0F72F3] rounded-[8px] bg-white px-[16px] py-[12px]">
      {/* Header - Always visible */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <span className="text-[#0F72F3] font-medium text-[14px]">See all the lessons</span>
        <Image
          src="/assets/icon/chevron-down.svg"
          alt="chevron"
          width={10}
          height={6}
          className={cn('transition-transform duration-200', {
            'rotate-180': isExpanded,
          })}
        />
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t-2 border-[#EAECF0] pt-[12px] mt-[12px]">
          <div className="flex flex-col">
            {collections.map((collection, collectionIndex) => (
              <div
                key={collection.id}
                onClick={() => onCollectionSelect(collectionIndex)}
                className={cn('cursor-pointer py-[4px] relative', {
                  'text-[#0F72F3] font-medium ': collectionIndex === selectedCollectionIndex,
                  'text-[#475467]': collectionIndex !== selectedCollectionIndex,
                })}
              >
                {collectionIndex === selectedCollectionIndex && (
                  <div className="absolute rounded-full -left-[10px] top-[0px] w-0 h-full border-l-4 border-[#FFC858]" />
                )}
                <p className="text-[14px] line-clamp-1">{[collection.title_prefix, collection.title].filter(Boolean).join(': ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarMobile;

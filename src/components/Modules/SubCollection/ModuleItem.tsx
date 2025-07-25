'use client';

import Image from 'next/image';
import Link from 'next/link';

import useExpandableText from '@/hooks/useExpandableText';
import { CollectionResponseType, SubCollectionItem } from '@/lib/interfaces/resource';
import { useMemo } from 'react';

interface ModuleItemProps {
  item: SubCollectionItem;
  type: CollectionResponseType;
}

const ModuleItem = ({ item }: ModuleItemProps) => {
  const { title, description, thumbnail } = item;
  const { isExpanded, isOverflowing, textRef, toggleExpand } =
    useExpandableText<HTMLParagraphElement>();

  const resourceUrl = useMemo(() => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams.toString();
    return `/mission-details/${item.resource_id}${searchParams ? `?${searchParams}` : ''}`;
  }, [item.resource_id]);

  return (
    <Link
      href={resourceUrl}
      className="flex flex-row gap-[12px] md:gap-[30px] w-full"
    >
      {/* Thumbnail */}
      <div className="relative w-[177px] aspect-[177/110] h-fit md:w-[232px]  md:aspect-[232/138] shrink-0">
        {/* Shadow Layer 2 (lop 2) */}
        <div className="w-[95%] absolute inset-0 bg-black/10 rounded-[4px] translate-x-[6px] translate-y-[-6px] z-1"></div>

        {/* Shadow Layer 1 (lop 1) */}
        <div className="w-[97%] absolute inset-0 bg-black/20 rounded-[4px] translate-x-[4px] translate-y-[-3px] z-2"></div>

        {/* Main Image */}
        <div className="absolute inset-0 rounded-[4px] overflow-hidden z-3 aspect-[177/110] md:aspect-[232/138]">
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
        <h3 className="text-[18px] font-medium text-black line-clamp-2">{title}</h3>
        <div className="relative">
          <p
            id="module-description"
            ref={textRef}
            className={`text-[#667085] text-[16px] ${
              !isExpanded ? 'line-clamp-2' : ''
            }`}
          >
            {description}
          </p>
          {(isOverflowing || isExpanded) && (
            <button
              onClick={toggleExpand}
              className="text-[#000000] font-[700] text-[16px] ml-1 mt-1 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ModuleItem;

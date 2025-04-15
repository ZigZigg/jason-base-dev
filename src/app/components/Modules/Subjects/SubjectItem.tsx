'use client';

import Image from 'next/image';
import React from 'react';
import { subjectItemData } from './subjectItemData';
import Link from 'next/link';

type Props = {
  id?: number;
  item?: (typeof subjectItemData)[0];
  parentSubject:{
    id: number;
    name: string;
  }
};

const SubjectItem = ({ id, item, parentSubject }: Props) => {
  // If an id is provided, find the item in mock data, otherwise use provided item or first item
  const subjectItem = id
    ? subjectItemData.find((item) => item.id === id) || subjectItemData[0]
    : item || subjectItemData[0];

  return (
    <Link href={`/resource/${subjectItem.id}?parentSubjectId=${parentSubject.id}&parentSubjectName=${parentSubject.name}`} className="block">
      <div className="w-full rounded-[16px] md:rounded-[24px] flex flex-col transition-transform hover:scale-[1.02] cursor-pointer">
        <Image
          src={subjectItem.imageUrl}
          alt={subjectItem.label}
          width={384}
          height={142}
          className="aspect-[343/170] md:aspect-[276/170] rounded-[16px] object-cover"
          loading="lazy"
        />
        <div className="mt-[12px] flex flex-col gap-[4px]">
          <span className="text-[14px] xl:text-[16px] font-[600] text-[#333333] line-clamp-2">
            {subjectItem.label}
          </span>
          {/* <div className="flex flex-row gap-[4px] items-center">
            <Image
              src="/assets/icon/video.svg"
              alt="Subject Icon"
              width={16}
              height={16}
              loading="lazy"
            />
            <span className="text-[14px] font-[400] text-[#667085]">
              {subjectItem.moduleCounts} modules - {subjectItem.videoCounts} videos
            </span>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default SubjectItem;

'use client';

import { ExtendedResourceAsset } from '@/lib/interfaces/resource';
import Image from 'next/image';
import { useMemo } from 'react';
import { getAssociatedResourceThumbnail } from '../selectors';
import Link from 'next/link';

type Props = {
  associatedResource: ExtendedResourceAsset;
};

const AssociatedResource = ({ associatedResource }: Props) => {
  const thumbnail = useMemo(
    () => getAssociatedResourceThumbnail(associatedResource),
    [associatedResource]
  );

  return (
    <Link href={`/resource-detail/${associatedResource.id}`} key={associatedResource.id} className="flex flex-col lg:flex-row gap-[16px] md:gap-[30px]">
      <div className="w-full aspect-[287/170] md:aspect-[175/100] md:w-[175px] md:h-[100px] relative flex-shrink-0">
        <Image
          src={thumbnail}
          alt={associatedResource.title}
          width={175}
          height={100}
          className="object-cover w-full h-full rounded-[8px]"
        />
      </div>
      <div className="flex-1">
        <p className="font-[500] text-[18px] text-[#000000]">{associatedResource.title}</p>
        <p className="font-[500] text-[#DE1514] text-[14px]">{associatedResource.type.name}</p>
        <p className="mt-2 text-[16px] text-[#667085]">{associatedResource.description}</p>
      </div>
    </Link>
  );
};

export default AssociatedResource;

'use client';

import { RawHtml } from '@/components/RawHtml';
import SafeImage from '@/components/SafeImage';
import { ExtendedResourceAsset } from '@/lib/interfaces/resource';
import Link from 'next/link';
import { useMemo } from 'react';
import { getAssociatedResourceThumbnail } from '../selectors';

type Props = {
  associatedResource: ExtendedResourceAsset;
};

const AssociatedResource = ({ associatedResource }: Props) => {
  const resourceUrl = useMemo(() => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams.toString();
    return `/resource-detail/${associatedResource.id}${searchParams ? `?${searchParams}` : ''}`;
  }, [associatedResource.id]);

  const thumbnail = useMemo(() => getAssociatedResourceThumbnail(associatedResource), [associatedResource]);

  return (
    <Link href={resourceUrl} key={associatedResource.id} className="flex flex-col lg:flex-row gap-[16px] md:gap-[30px]">
      <div className="w-full aspect-[287/170] md:aspect-[175/100] md:w-[175px] md:h-[100px] relative flex-shrink-0">
        <SafeImage
          src={thumbnail.uri || thumbnail.fallbackUri}
          fallbackUri={thumbnail.fallbackUri}
          alt={associatedResource.title}
          width={175}
          height={100}
          className="object-cover w-full h-full rounded-[8px]"
        />
      </div>
      <div className="flex-1">
        <p className="font-[500] text-[18px] text-[#000000]">{associatedResource.title}</p>
        <p className="font-[500] text-[#DE1514] text-[14px]">{associatedResource.type.name}</p>
        <p className="mt-2 text-[16px] text-[#667085]">
          <RawHtml>{associatedResource.description}</RawHtml>
        </p>
      </div>
    </Link>
  );
};

export default AssociatedResource;

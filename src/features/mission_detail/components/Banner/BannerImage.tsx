'use client';

import { RawHtml } from '@/components/RawHtml';
import Image from 'next/image';


type Props = {
  banner: string;
  description?: string;
  htmlDescription?: string;
};

const BannerImage = ({ banner, description, htmlDescription }: Props) => {
  return (
      <div className="w-full bg-[#EAF0FC] rounded-[16px] flex flex-col overflow-hidden">
        {/* Banner Image */}
        <div className="w-full aspect-[343/88] md:aspect-[1160/300]">
          <Image
            src={banner}
            alt={''}
            width={1160}
            height={300}
            className="w-full h-full object-cover aspect-[343/88] md:aspect-[1160/300]"
          />
        </div>

        {/* Banner Text Content */}
        {description && (
          <div className="flex flex-col items-start justify-center gap-[8px] p-[16px] md:p-[24px] text-[16px] text-[#667085]">
            { htmlDescription ? <RawHtml>{htmlDescription}</RawHtml> : description }
          </div>
        )}
      </div>
    );
};

export default BannerImage;

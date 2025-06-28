'use client';

import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { TVideoResource } from '../selectors';

type Props = {
  videoResource: TVideoResource | undefined;
  title: string;
};

const Banner = ({ videoResource, title }: Props) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-[30px]">
      <div className="w-full md:w-2/3">
        <div className="w-full bg-[#EAF0FC] rounded-[16px] flex flex-col overflow-hidden">
          <div className="w-full aspect-[343/88] md:aspect-[1160/300]">
            {videoResource ? (
              <VideoPlayer file_uri={videoResource.file_uri} thumbnail_file_uri={videoResource.thumbnail_file_uri} />
            ): (
              <Image
                src='/assets/subjects/default-banner.jpg'
                alt={title}
                width={1160}
                height={300}
                className="w-full h-full object-cover aspect-[343/88] md:aspect-[1160/300]"
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/3 p-5 text-[#667085] text-[14px]">
        <p className="mb-5 font-bold">{ title }</p>
        <p>{videoResource?.description}</p>
      </div>
    </div>
  );
};

export default Banner;

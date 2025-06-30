'use client';

import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { TVideoResource } from '../selectors';

type Props = {
  videoResource: TVideoResource | undefined;
  banner?: string;
  description?: string;
};

const Banner = ({ videoResource, banner, description }: Props) => {
  const renderVideo = () => {
    if (!videoResource) {
      return null;
    }
    return (
      <div className="w-full flex flex-col md:flex-row gap-[20px] md:gap-[30px]">
        <div className="w-full md:w-2/3">
          <div className="w-full bg-[#EAF0FC] rounded-[16px] flex flex-col overflow-hidden">
            <div className="w-full aspect-[343/88] md:aspect-[1160/300]">
              <VideoPlayer
                file_uri={videoResource.file_uri}
                thumbnail_file_uri={videoResource.thumbnail_file_uri}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 p-[0px] md:p-[20px] text-[#667085] text-[14px]">
          {description}
        </div>
      </div>
    );
  };

  const renderBanner = () => {
    if (!banner) {
      return <div className="p-5 pb-0 text-[#667085] text-[14px]">{description}</div>
    }

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
        <div className="flex flex-col items-start justify-center gap-[8px] p-[16px] md:p-[24px] text-[14px] md:text-[16px] text-[#667085]">
          {description}
        </div>
      </div>
    );
  };

  return <>{videoResource ? renderVideo() : renderBanner()}</>;
};

export default Banner;

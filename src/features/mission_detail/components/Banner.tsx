'use client';

import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { TVideoResource } from '../selectors';

type Props = {
  videoResource: TVideoResource | undefined;
  title: string;
  banner?: string;
  description?: string;
};

const Banner = ({ videoResource, title, banner, description }: Props) => {
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
          <p className="mb-[12px] font-bold text-[20px] text-[#182230]">{title}</p>
          <p>{description}</p>
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
            alt={title || ''}
            width={1160}
            height={300}
            className="w-full h-full object-cover aspect-[343/88] md:aspect-[1160/300]"
          />
        </div>

        {/* Banner Text Content */}
        <div className="flex flex-col items-start justify-center gap-[8px] p-[16px] md:p-[24px]">
          <h2 className="text-[16px] md:text-[20px] font-bold text-[#182230]">{title}</h2>
          <p className="text-[14px] md:text-[16px] text-[#667085]">{description}</p>
        </div>
      </div>
    );
  };

  return <>{videoResource ? renderVideo() : renderBanner()}</>;
};

export default Banner;

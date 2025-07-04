'use client';


import VideoPlayer from '@/components/VideoPlayer';

import { TVideoResource } from '../../selectors';

type Props = {
  videoResource: TVideoResource;
  description?: string;
};

const BannerVideo = ({ videoResource, description }: Props) => {
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

      <div className="w-full md:w-1/3 p-[0px] md:p-[20px] text-[#667085] text-[16px]">
        {description}
      </div>
    </div>
  );
};

export default BannerVideo;

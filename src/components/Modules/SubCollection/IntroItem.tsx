import VideoPlayer from '@/components/VideoPlayer';
import { TVideoAsset } from '@/selectors/video_asset_selector';
import Image from 'next/image';

type Props = {
  videoAsset?: TVideoAsset;
  banner?: string;
  title?: string;
  description?: string;
};

const IntroItem = (props: Props) => {
  const { videoAsset, banner, title, description } = props;

  const renderVideo = () => {
    if (!videoAsset) {
      return null;
    }
    return (
      <div className="w-full flex flex-col md:flex-row gap-10">
        {/* Banner Image */}
        <div className="w-full md:w-2/3">
          <div className="w-full bg-[#EAF0FC] rounded-[16px] flex flex-col overflow-hidden">
            <div className="w-full aspect-[343/88] md:aspect-[1160/300]">
              <VideoPlayer
                file_uri={videoAsset.video_file_uri}
                thumbnail_file_uri={videoAsset.video_thumbnail_file_uri}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="w-full md:w-1/3 flex justify-start">
          <p className="text-[14px] md:text-[16px] text-[#667085]">{description}</p>
        </div>
      </div>
    );
  };

  const renderBanner = () => {
    if (!banner) {
      return null;
    }
    return (
        <div className="w-full bg-[#EAF0FC] rounded-[16px] flex flex-col overflow-hidden">
        {/* Banner Image */}
        <div className="w-full aspect-[343/88] md:aspect-[1160/300]">
          <Image
            src={banner || '/assets/subjects/default-banner.jpg'}
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

  return <>{videoAsset ? renderVideo() : renderBanner()}</>;
};

export default IntroItem;

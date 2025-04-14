'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { VideoResourceCollection } from '@/app/lib/modules/resource/data';

interface VideoPlayerProps {
  videoObject: VideoResourceCollection;
  resource: ResourceCollection | null;
}

const VideoPlayer = ({ videoObject, resource }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div id="video-player" className="flex-1 flex flex-col order-2 md:order-1 z-0">
      <div className="mb-[16px]">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
          {/* Video Element */}
          <video
            ref={videoRef}
            src={videoObject.videoObject?.file_uri}
            className="w-full h-full"
            onClick={handlePlayPause}
            controls
          />
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-center mb-[4px]">
          <h4 className="!mb-0 text-[24px] font-[700] text-[#333333]">{videoObject.title}</h4>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <Image
            src="/assets/icon/group.svg"
            alt="Grade Icon"
            width={18}
            height={18}
            className="flex-shrink-0"
          />
          <span className="!text-[#475467] font-[600] text-[16px]">Grades:</span>
          <span className="!text-[#667085] font-[400] text-[16px]">
            {resource?.grades.map((grade) => grade.name).join(', ')}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <span className="text-gray-500">{videoObject.description}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

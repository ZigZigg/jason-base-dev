'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { VideoResourceCollection } from '@/app/lib/modules/resource/data';
import { Spin } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';

interface VideoPlayerProps {
  videoObject: VideoResourceCollection;
  resource: ResourceCollection | null;
}

const VideoPlayer = ({ videoObject, resource }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const thumbnailUrl = useMemo(() => {
    if (videoObject.thumbnailObject?.file_uri) {
      return videoObject.thumbnailObject?.file_uri;
    }
    return null;
  }, [videoObject]);

  // Reset states when video changes
  useEffect(() => {
    setShowThumbnail(true);
    setIsLoading(true);
    setIsPlaying(false);

    // If video was already loaded, force a reload
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoObject.id]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowThumbnail(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadStart = () => {
        setIsLoading(true);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      const handlePlay = () => {
        setShowThumbnail(false);
      };

      videoElement.addEventListener('loadstart', handleLoadStart);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('play', handlePlay);

      return () => {
        videoElement.removeEventListener('loadstart', handleLoadStart);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('play', handlePlay);
      };
    }
  }, []);

  return (
    <div id="video-player" className="flex-1 flex flex-col order-2 md:order-1 z-0">
      <div className="mb-[16px]">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
          {showThumbnail && thumbnailUrl && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-black"
              onClick={!isLoading ? handlePlayPause : undefined}
              style={!isLoading ? { cursor: 'pointer' } : undefined}
            >
              <Image
                src={thumbnailUrl}
                alt="Video thumbnail"
                layout="fill"
                objectFit="contain"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {isLoading ? (
                  <Spin size="large" />
                ) : (
                  <PlayCircleFilled className="text-white text-6xl opacity-80 hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            src={videoObject.videoObject?.file_uri}
            className="w-full h-full"
            onClick={handlePlayPause}
            controls
            preload="auto"
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

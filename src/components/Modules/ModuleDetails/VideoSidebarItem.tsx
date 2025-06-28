'use client';

import { VideoResourceCollection } from '@/lib/interfaces/resource';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface VideoSidebarItemProps {
  video: VideoResourceCollection;
  isSelected: boolean;
  onSelect: () => void;
  shouldLoadMetadata?: boolean;
}

const VideoSidebarItem = ({ video, isSelected, onSelect, shouldLoadMetadata = true }: VideoSidebarItemProps) => {
  const [duration, setDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Get video duration when component mounts or video url changes
  useEffect(() => {
    // Only load metadata if shouldLoadMetadata is true
    if (!shouldLoadMetadata) return;

    const videoSrc = video.videoObject?.file_uri;
    if (!videoSrc) return;

    // Create video element if it doesn't exist
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
    }

    const videoElement = videoRef.current;
    
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
    };

    const handleError = () => {
      console.error(`Error loading video metadata for ${videoSrc}`);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('error', handleError);
    
    // Set crossOrigin to allow loading from different domains
    videoElement.src = videoSrc;
    videoElement.preload = 'metadata';
    videoElement.load();

    return () => {
      // Clean up
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeAttribute('src');
      videoElement.load();
    };
  }, [video.videoObject?.file_uri, shouldLoadMetadata]);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number | null): string => {
    if (!seconds || isNaN(seconds)) return "--:--";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div 
      id="video-sidebar-item"
      className="no-underline block cursor-pointer"
      onClick={onSelect}
    >
      <div
        className={`flex flex-row md:flex-col xl:flex-row p-2 rounded-lg ${
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
        }`}
      >
        {/* Thumbnail */}
        <div className="relative w-[102px] h-[60px] md:w-full md:h-[60px] xl:w-[102px] xl:h-[60px] flex-shrink-0">
          <Image
            src={video.thumbnailObject?.file_uri || ''}
            alt={video.thumbnailObject?.name || ''}
            width={102}
            height={60}
            style={{ objectFit: 'cover' }}
            className="rounded h-[60px] w-[102px] md:h-[60px] md:w-full xl:h-[60px] xl:w-[102px]"
          />
          <div id="video-duration" className="absolute bottom-[3px] right-[3px] bg-[#00000066] px-[6px] rounded-[4px] text-[12px] text-white">
            {formatDuration(duration)}
          </div>
        </div>

        {/* Video info */}
        <div className="ml-2 flex-1">
          <span
            className={`block text-[16px] md:text-[14px] xl:text-[14px] font-medium line-clamp-2 ${
              isSelected ? 'text-blue-600' : 'text-gray-900'
            }`}
            title={video.title || ''}
          >
            {video.title || ''}
          </span>
          <span className="text-[12px] !text-[#0F72F3]">
            {video.type?.name || "Video"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoSidebarItem; 
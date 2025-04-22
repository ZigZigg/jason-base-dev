'use client';

import { VideoResourceCollection } from '@/app/lib/modules/resource/data';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import VideoSidebarItem from './VideoSidebarItem';

interface VideoSidebarProps {
  videos: VideoResourceCollection[];
  selectedVideoId?: number | string;
  onSelectVideo: (video: VideoResourceCollection) => void;
}

const VideoSidebar = ({ videos, selectedVideoId, onSelectVideo }: VideoSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Default to expanded on desktop
  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    // Only add the event listener if the sidebar is expanded on mobile
    if (isMobile && isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine if we should load metadata based on device and expanded state
  // On desktop, always load metadata
  // On mobile, only load when expanded
  const shouldLoadMetadata = !isMobile || isExpanded;

  return (
    <div
      id="video-sidebar-container"
      ref={sidebarRef}
      className={`w-full md:w-[320px] md:h-fit border-[#0F72F3] md:border-[#F2F4F7] border rounded-[12px] flex flex-col px-[16px] pt-[0px] gap-[4px] md:relative ${
        isExpanded && 'rounded-b-[0px]'
      } md:rounded-b-[12px]`}
    >
      <div
        id="video-sidebar-header"
        className={`w-full h-[66px] border-b-[#fff] ${
          isExpanded && '!border-b-[#EAECF0]'
        } md:border-b-[#EAECF0] border-b-[2px] flex flex-row items-center justify-between cursor-pointer bg-white rounded-t-[12px] z-10`}
        onClick={toggleExpanded}
      >
        <span className="text-[16px] font-[700] text-[#475467]">Playwatch Videos</span>
        <Image
          className={`block md:hidden transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          src="/assets/icon/chevron-down.svg"
          alt="Toggle videos"
          width={16}
          height={16}
        />
      </div>

      <div
        id="video-sidebar-content"
        className={`flex flex-col overflow-y-auto transition-all duration-300 ease-in-out max-h-0 opacity-0 invisible md:max-h-[532px] md:opacity-100 md:visible ${
          isMobile && isExpanded && '!max-h-[532px] !opacity-100 !visible'
        } ${
          isMobile
            ? 'absolute top-[67px] left-[16px] right-[16px] bg-white rounded-b-[12px] border-[#0F72F3] border border-t-0 z-20'
            : ''
        }`}
      >
        {videos.map((video) => (
          <VideoSidebarItem
            key={video.id}
            video={video}
            isSelected={video.id === selectedVideoId}
            shouldLoadMetadata={shouldLoadMetadata}
            onSelect={() => {
              onSelectVideo(video);
              setIsExpanded(false);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoSidebar;

'use client';

import { VideoResourceCollection } from '@/lib/interfaces/resource';
import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import VideoSidebarItem from './VideoSidebarItem';

interface VideoSidebarProps {
  videos: VideoResourceCollection[];
  selectedVideoId?: number | string;
  onSelectVideo: (video: VideoResourceCollection) => void;
}

interface VideoGroup {
  id: string;
  title: string;
  title_prefix?: string;
  videos: VideoResourceCollection[];
  totalCount: number;
}

const VideoSidebar = ({ videos, selectedVideoId, onSelectVideo }: VideoSidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Group videos by parent_object.id
  const videoGroups: VideoGroup[] = useMemo(() => {
    const groups: { [key: string]: VideoGroup } = {};

    videos.forEach((video) => {
      const parentId = video.parent_object?.id || 'default';
      const parentTitle = video.parent_object?.title || 'Playwatch Videos';
      const parentTitlePrefix = video.parent_object?.title_prefix;

      if (!groups[parentId]) {
        groups[parentId] = {
          id: parentId,
          title: parentTitle,
          title_prefix: parentTitlePrefix,
          videos: [],
          totalCount: 0,
        };
      }

      groups[parentId].videos.push(video);
      groups[parentId].totalCount++;
    });

    return Object.values(groups);
  }, [videos]);

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

  // Default to first section expanded on desktop, all collapsed on mobile
  useEffect(() => {
    if (!isMobile && videoGroups.length > 0) {
      setExpandedSections(new Set([videoGroups[0].id]));
    } else {
      setExpandedSections(new Set());
    }
  }, [isMobile, videoGroups]);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        expandedSections.size > 0 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setExpandedSections(new Set());
      }
    };

    // Only add the event listener if any section is expanded on mobile
    if (isMobile && expandedSections.size > 0) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, expandedSections]);

  const toggleSection = (sectionId: string) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(sectionId)) {
      newExpandedSections.delete(sectionId);
    } else {
      newExpandedSections.add(sectionId);
    }
    setExpandedSections(newExpandedSections);
  };

  const handleVideoSelect = (video: VideoResourceCollection) => {
    onSelectVideo(video);
    // On mobile, collapse all sections after selecting a video
    if (isMobile) {
      setExpandedSections(new Set());
    }
  };

  // Find which section contains the selected video to determine active state
  const getSelectedVideoSection = () => {
    return videoGroups.find((group) => group.videos.some((video) => video.id === selectedVideoId));
  };

  const selectedSection = getSelectedVideoSection();

  return (
    <div
      id="video-sidebar-container"
      ref={sidebarRef}
      className="w-full md:h-fit flex flex-col gap-[20px] md:relative"
    >
      {videoGroups.map((group) => {
        const isExpanded = expandedSections.has(group.id);
        const isActive = selectedSection?.id === group.id;
        const shouldLoadMetadata = !isMobile || isExpanded;

        // Find the position of the selected video within this group (1-based index)
        const selectedVideoIndex =
          group.videos.findIndex((video) => video.id === selectedVideoId) + 1;
        const currentPosition = selectedVideoIndex > 0 ? selectedVideoIndex : 1;

        return (
          <div
            key={group.id}
            className={`border-2 gap-[4px] px-[16px] md:px-[10px] xl:px-[16px] ${
              isActive ? 'border-[#0F72F3]' : 'border-[#F2F4F7]'
            } rounded-[12px] flex flex-col ${
              isMobile && isExpanded ? 'overflow-visible' : 'overflow-hidden'
            }`}
          >
            {/* Section Header */}
            <div
              className={`w-full pt-[16px] pb-[12px] border-b-2 ${
                isExpanded ? 'border-b-[#EAECF0]' : 'border-b-transparent'
              } flex flex-row items-end justify-between cursor-pointer bg-white rounded-t-[12px] z-10`}
              onClick={() => toggleSection(group.id)}
            >
              <div className="flex flex-col gap-0">
                {group.title_prefix && (
                  <span className="text-[12px] font-[400] text-[#667085] leading-[18px]">
                    {group.title_prefix}
                  </span>
                )}
                <span className="text-[16px] font-[700] text-[#475467] leading-[24px]">
                  {group.title}
                </span>
              </div>
              <div className="flex flex-row items-center gap-[12px]">
                <span className="text-[16px] font-[700] text-[#475467]">
                  {currentPosition}/{group.totalCount}
                </span>
                <Image
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  src="/assets/icon/chevron-down.svg"
                  alt="Toggle section"
                  width={14}
                  height={10}
                />
              </div>
            </div>

            {/* Section Content */}
            <div
              id="video-sidebar-content"
              className={`flex flex-col transition-all duration-300 ease-in-out ${
                !isExpanded
                  ? 'max-h-0 opacity-0 invisible overflow-hidden'
                  : 'max-h-[532px] opacity-100 visible overflow-y-auto'
              } ${isMobile && isExpanded ? 'bg-white z-20' : ''}`}
            >
              <div className="flex flex-col pb-[16px] gap-[4px] md:gap-[10px] xl:gap-[4px]">
                {group.videos.map((video) => (
                  <VideoSidebarItem
                    key={video.id}
                    video={video}
                    isSelected={video.id === selectedVideoId}
                    shouldLoadMetadata={shouldLoadMetadata}
                    onSelect={() => handleVideoSelect(video)}
                  />
                ))}
              </div>

              {/* Scrollbar indicator */}
              {group.videos.length > 6 && (
                <div className="absolute right-[16px] top-[50%] translate-y-[-50%] w-[4px] h-[144px] bg-[#C4C4C4] rounded-[4px]" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoSidebar;

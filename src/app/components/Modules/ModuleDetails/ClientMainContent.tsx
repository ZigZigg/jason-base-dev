'use client';

import { useEffect, useState } from 'react';
import VideoSidebar from './VideoSidebar';
import VideoPlayer from './VideoPlayer';
import { Empty } from 'antd';
import { VideoResourceCollection } from '@/app/lib/interfaces/resource';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import BaseButton from '@/app/atomics/button/BaseButton';
import { useRouter } from 'next/navigation';

type Props = {
  initialData: {
    results: VideoResourceCollection[];
    resource: ResourceCollection | null;
  };
  parentSubject: {
    id: number;
    name: string;
  };
};

const ClientMainContent = ({ initialData, parentSubject }: Props) => {

  const [videos] = useState<VideoResourceCollection[]>(initialData?.results || []);
  const { setItems } = useBreadcrumb();
  const [selectedVideo, setSelectedVideo] = useState<VideoResourceCollection | null>(
    videos.length > 0 ? videos[0] : null
  );
  const router = useRouter();
  const handleSelectVideo = (video: VideoResourceCollection) => {
    // Find the matching video collection
    const matchingVideo = videos.find((v) => v.id === video.id);
    if (matchingVideo) {
      setSelectedVideo(matchingVideo);
    }
  };

  const goToEducatorResources = () => {
    const educatorResourceId = initialData.resource?.educator_resource?.id;
    router.push(`/resource/${initialData.resource?.id}/content/${educatorResourceId}`);
  }

  useEffect(() => {
    let levelObject = null;
    // get search path from url
    const searchPath = window.location.search;
    if (parentSubject.name === 'Search') {
      levelObject = {
        title: 'Search',
        path: `/search`,
      };
    } else if (searchPath) {
      levelObject = {
        title: parentSubject.name,
        path: `/subjects/${parentSubject.id}`,
      };
    }

    const breadcrumbItems = [];

    if (levelObject) {
      breadcrumbItems.push(levelObject);
    }

    breadcrumbItems.push({
      title: initialData.resource?.title || '',
      path: `/resource/${initialData.resource?.id}${searchPath}`,
    });

    setItems(breadcrumbItems);
    return () => {
      setItems([]);
    };
  }, [initialData.resource, parentSubject]);

  if (videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Empty description="No videos available for this resource" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-row items-center justify-between px-[16px] xl:px-[0px] mb-[24px] gap-[16px]">
        <h1 className="xl:text-[40px] text-[28px] font-bold !mb-0 xl:leading-[48px] leading-[32px]">{initialData.resource?.title}</h1>
        {
          initialData.resource?.educator_resource && (
            <div className="flex flex-row items-center gap-2">
              <BaseButton onClick={goToEducatorResources} className='!px-[16px] !py-[8px] !border-1 !border-[#1371FF] !gap-[0px] !rounded-[8px] !bg-[#0F72F31A] flex flex-col !items-start'>
                <span className='text-[#667085] text-[12px] font-[400]'>Check out this</span>
                <span className='text-[#475467] text-[16px] font-[700]'>Educator Resources</span>
              </BaseButton>
            </div>
          )
        }
      </div>
      <div
        id="resource-container"
        className="flex flex-col md:flex-row gap-[40px] relative px-[16px] xl:px-[0px]"
      >
        <div id="video-sidebar" className="w-full md:w-[320px] order-1 md:order-2 z-10">
          <VideoSidebar
            videos={videos}
            selectedVideoId={selectedVideo?.id}
            onSelectVideo={handleSelectVideo}
          />
        </div>

        {/* Main content - Video Player area */}
        <div id="video-player" className="flex-1 flex flex-col order-2 md:order-1 z-0">
          {selectedVideo ? (
            <VideoPlayer videoObject={selectedVideo} resource={initialData.resource} />
          ) : (
            <Empty description="No video selected" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientMainContent;

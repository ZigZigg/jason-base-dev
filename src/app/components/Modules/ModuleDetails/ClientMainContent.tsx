'use client';

import { useEffect, useState } from 'react';
import VideoSidebar from './VideoSidebar';
import VideoPlayer from './VideoPlayer';
import { Empty } from 'antd';
import { VideoResourceCollection } from '@/app/lib/modules/resource/data';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';

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

  const handleSelectVideo = (video: VideoResourceCollection) => {
    // Find the matching video collection
    const matchingVideo = videos.find((v) => v.id === video.id);
    if (matchingVideo) {
      setSelectedVideo(matchingVideo);
    }
  };

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
    <>
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
    </>
  );
};

export default ClientMainContent;

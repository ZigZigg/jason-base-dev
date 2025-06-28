'use client';

import { SubCollectionObjectResponse } from '@/app/lib/interfaces/resource';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { useEffect } from 'react';
import EmptyResult from '../Search/Commons/EmptyResult';
import ModuleItem from './ModuleItem';

interface SubCollectionProps {
  module: SubCollectionObjectResponse;
  parentSubject: {
    id: number;
    name: string;
  };
}

const SubCollection = ({ module, parentSubject }: SubCollectionProps) => {
  const { data, title, description, banner, type, videoAsset } = module;
  const { setItems } = useBreadcrumb();

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
      title: module.title || '',
      path: `/resource/${module.id}${searchPath}`,
    });

    setItems(breadcrumbItems);
    return () => {
      setItems([]);
    };
  }, [module, parentSubject]);

  return (
    <div className="w-full flex flex-col gap-6 px-4 xl:px-0 pb-[60px]">
      {/* Title */}
      <h1 className="text-2xl lg:text-[40px] lg:leading-[52px] text-[#333333]">{title}</h1>

      <div className="w-full flex flex-col md:flex-row gap-10">

        {/* Banner Image */}
        <div className="w-full md:w-2/3">
          <div className="w-full bg-[#EAF0FC] rounded-[16px] flex flex-col overflow-hidden">
            <div className="w-full aspect-[343/88] md:aspect-[1160/300]">
              {videoAsset ? (
                <VideoPlayer file_uri={videoAsset.video_file_uri} thumbnail_file_uri={videoAsset.video_thumbnail_file_uri} />
              ): (
                <Image
                  src={banner || '/assets/subjects/default-banner.jpg'}
                  alt={title}
                  width={1160}
                  height={300}
                  className="w-full h-full object-cover aspect-[343/88] md:aspect-[1160/300]"
                />
              )

              }
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="w-full md:w-1/3 flex justify-end">
          <p className="text-[14px] md:text-[16px] text-[#667085]">{description}</p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.map((module, index) => (
            <div key={index} className="w-full">
              <ModuleItem item={module} type={type} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyResult title="No modules available" />
      )}
    </div>
  );
};

export default SubCollection;

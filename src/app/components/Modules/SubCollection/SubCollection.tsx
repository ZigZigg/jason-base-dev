'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import ModuleItem from './ModuleItem';
import { SubCollectionObjectResponse } from '@/app/lib/interfaces/resource';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import EmptyResult from '../Search/Commons/EmptyResult';

interface SubCollectionProps {
  module: SubCollectionObjectResponse;
  parentSubject: {
    id: number;
    name: string;
  };
}

const SubCollection = ({ module, parentSubject }: SubCollectionProps) => {
  const { data, title, description, banner, type } = module;
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
    <div className="w-full flex flex-col gap-[50px] pb-[60px]">
      {/* Banner */}
      <div className="w-full bg-[#EAF0FC] rounded-[16px] flex flex-col overflow-hidden">
        {/* Banner Image */}
        <div className="w-full aspect-[343/88] md:aspect-[1160/300]">
          <Image
            src={banner || '/assets/subjects/default-banner.jpg'}
            alt={title}
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

      {/* Module List */}
      <div className="w-full flex flex-col gap-[24px]">
        {data.length > 0 ? (
          <>
            {/* Header with Count and Sort */}
            {/* <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[24px]">
                <div className="text-[14px] md:text-[16px] text-[#475467]">
                  {data.length} modules
                </div>
              </div> */}

            {/* Module Items */}
            <div className="w-full flex flex-col gap-[24px]">
              {data.map((module, index) => (
                <ModuleItem key={index} item={module} type={type} />
              ))}
            </div>
          </>
        ) : (
          <EmptyResult title="No modules available" />
        )}
      </div>
    </div>
  );
};

export default SubCollection;

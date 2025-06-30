'use client';

import { SubCollectionObjectResponse } from '@/lib/interfaces/resource';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';
import { useEffect } from 'react';
import EmptyResult from '../Search/Commons/EmptyResult';
import IntroItem from './IntroItem';
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
    <div className="w-full flex flex-col gap-[20px] px-4 xl:px-0 pb-[60px]">
      {/* Title */}
      <h1 className="text-[24px] lg:text-[40px] lg:leading-[52px] text-[#333333] font-bold">{title}</h1>

      <IntroItem videoAsset={videoAsset} banner={banner} description={description} />
      <span className="text-[16px] text-[#475467]">{`${data.length} modules in ${title}`}</span>
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

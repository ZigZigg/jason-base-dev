'use client';

import { useEffect, useMemo, useState } from 'react';

import EducatorResourceButton from '@/components/Modules/ModuleDetails/EducatorResourceButton';
import { ResourceCollectionResponse } from '@/lib/interfaces/resource';
import { ResourceCollection } from '@/lib/modules/subjects/data';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';

import { getVideoResource } from '../selectors';
import Banner from './Banner/Banner';
import CollectionDetail from './CollectionDetail';
import Sidebar from './SideBar';
import SidebarMobile from './SidebarMobile';

type Props = {
  resource: ResourceCollection;
  collection: ResourceCollectionResponse;
  parentCollection: ResourceCollectionResponse | null;
  sideBarCollections: ResourceCollectionResponse[];
};

const MissionDetail = ({ resource, collection, parentCollection, sideBarCollections }: Props) => {
  const { setItems } = useBreadcrumb();
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState<number>(0);

  const resourceContentHtmlFragment = resource?.html_fragments?.find((fragment) => (fragment.html_fragment?.type.name || fragment.type.name) === 'ResourceContent');
  const htmlDescription = resourceContentHtmlFragment?.html_fragment?.content || resourceContentHtmlFragment?.content;

  const fullTitle = useMemo(() => {
    return [collection.title_prefix, collection.title].filter(Boolean).join(': ');
  }, [collection]);

  const videoResource = useMemo(() => getVideoResource(collection, sideBarCollections), [
    collection, sideBarCollections,
  ]);

  useEffect(() => {
    const breadcrumbItems = [];

    const searchPath = window.location.search;
    if(searchPath){
      const urlParams = new URLSearchParams(searchPath);
      const parentSubjectId = urlParams.get('parentSubjectId');
      const parentSubjectName = urlParams.get('parentSubjectName');

      if (parentSubjectId && parentSubjectName) {
        breadcrumbItems.push({
          title: parentSubjectName,
          path: `/subjects/${parentSubjectId}`,
        });
      }
    }

    if (parentCollection) {
      breadcrumbItems.push({
        title: parentCollection.title_prefix ? `${parentCollection.title_prefix} - ${parentCollection.title}` : (parentCollection.title || ''),
        path: `/resource/${parentCollection.resource_id}`,
      });
    }

    breadcrumbItems.push({
      title: fullTitle,
      path: `/mission-details/${collection.resource_id}`,
    });

    setItems(breadcrumbItems);
    return () => {
      setItems([]);
    };
  }, [fullTitle]);

  const handleCollectionSelect = (collectionIndex: number) => {
    setSelectedCollectionIndex(collectionIndex);
  };

  const banner = useMemo(() => {
    return collection.resource?.assets?.find((resource) => resource.type.name === 'BannerMedium')
      ?.file_uri;
  }, [collection]);

  const description = useMemo(() => {
    return videoResource?.description || collection.description || resource.description;
  }, [collection, videoResource]);

  const selectedCollection = useMemo(
    () => sideBarCollections[selectedCollectionIndex],
    [sideBarCollections, selectedCollectionIndex]
  );
  const currentResource = useMemo(() => {
    return {
      ...collection,
      educator_resource: collection.educator_resources?.length ? collection.educator_resources[0] : null,
    } as any;
  }, [collection]);

  return (
    <div className="w-full flex flex-col gap-8 px-4 xl:px-0 pb-[60px]">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-[4px] md:gap-[16px]">
      <h1 className="text-[24px] md:text-[40px] lg:leading-[52px] font-[700] text-[#333333]">
        {fullTitle}
      </h1>
      {currentResource?.educator_resource && (
        <EducatorResourceButton resource={currentResource} />
      )}
      </div>


      <Banner
        banner={banner}
        description={description}
        videoResource={videoResource}
        htmlDescription={htmlDescription}
      />

      {/* Mobile Sidebar - Outside main container */}
      <div className="md:hidden mt-[10px]">
        <SidebarMobile
          collections={sideBarCollections}
          selectedCollectionIndex={selectedCollectionIndex}
          onCollectionSelect={handleCollectionSelect}
        />
      </div>

      <div id="mission-detail-sidebar" className="w-full flex flex-col md:flex-row gap-8 p-[12px] bg-[#EAF0FC] rounded-[16px]">
        <div className="hidden md:block w-full md:w-[260px] flex-shrink-0">
          <Sidebar
            collections={sideBarCollections}
            selectedCollectionIndex={selectedCollectionIndex}
            onCollectionSelect={handleCollectionSelect}
          />
        </div>

        <div className="flex-1 flex flex-col gap-[12px]">
          <div className="flex flex-col md:hidden py-[4px]">
            <span className="text-[14px] text-[#667085] font-[500]">{selectedCollection?.title_prefix || ''}</span>
            <span className="text-[18px] text-[#0F72F3] font-[700]">{selectedCollection?.title || ''}</span>
          </div>
          <CollectionDetail collection={selectedCollection} />
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;

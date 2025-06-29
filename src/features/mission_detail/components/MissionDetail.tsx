'use client';

import EducatorResourceButton from '@/components/Modules/ModuleDetails/EducatorResourceButton';
import { ResourceCollectionResponse } from '@/lib/interfaces/resource';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';
import { useEffect, useMemo, useState } from 'react';
import { getVideoResource, TVideoResource } from '../selectors';
import Banner from './Banner';
import CollectionDetail from './CollectionDetail';
import Sidebar from './SideBar';
import SidebarMobile from './SidebarMobile';

type Props = {
  collection: ResourceCollectionResponse;
  parentCollection: ResourceCollectionResponse | null;
  sideBarCollections: ResourceCollectionResponse[];
};

const MissionDetail = ({ collection, parentCollection, sideBarCollections }: Props) => {
  const { setItems } = useBreadcrumb();
  const [videoResource, setVideoResource] = useState<TVideoResource | undefined>(undefined);
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState<number>(0);

  useEffect(() => {
    const breadcrumbItems = [];

    if (parentCollection) {
      breadcrumbItems.push({
        title: parentCollection.title || '',
        path: `/resource/${parentCollection.resource_id}`,
      });
    }

    breadcrumbItems.push({
      title: [collection.title_prefix, collection.title].filter(Boolean).join(' : '),
      path: `/mission-details/${collection.resource_id}`,
    });

    setItems(breadcrumbItems);
    return () => {
      setItems([]);
    };
  }, []);

  useEffect(() => {
    const videoResource = getVideoResource(collection, sideBarCollections);
    setVideoResource(videoResource);
  }, []);


  const handleCollectionSelect = (collectionIndex: number) => {
    setSelectedCollectionIndex(collectionIndex);
  };

  const banner = useMemo(() => {
    return collection.resource?.assets?.find((resource) => resource.type.name === 'BannerMedium')
      ?.file_uri;
  }, [collection]);

  const description = useMemo(() => {
    return videoResource?.description || collection.resource?.description;
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
    <div className="w-full flex flex-col gap-6 px-4 xl:px-0 pb-[60px]">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-[4px] md:gap-[16px]">
      <h1 className="text-[24px] md:text-[40px] lg:leading-[52px] font-[700] text-[#333333]">
        {`${collection.title_prefix ? `${collection.title_prefix} : ` : ''}${collection.title}`}
      </h1>
      {currentResource?.educator_resource && (
        <EducatorResourceButton resource={currentResource} />
      )}
      </div>


      <Banner
        banner={banner}
        description={description}
        videoResource={videoResource}
        title={[collection.title_prefix, collection.title].filter(Boolean).join(' : ')}
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
          <div className="flex flex-col block md:hidden py-[4px]">
          <span className="text-[14px] text-[#667085] font-[500]">{collection?.title_prefix || ''}</span>
          <span className="text-[18px] text-[#0F72F3] font-[700]">{collection?.title || ''}</span>
        </div>
          <CollectionDetail collection={selectedCollection} />
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;

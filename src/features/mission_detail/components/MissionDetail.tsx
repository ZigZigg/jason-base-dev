'use client';

import { ResourceCollectionResponse } from '@/app/lib/interfaces/resource';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import { useEffect, useMemo, useState } from 'react';
import { getVideoResource, TVideoResource } from '../selectors';
import Banner from './Banner';
import CollectionDetail from './CollectionDetail';
import Sidebar from './SideBar';

type Props = {
  collection: ResourceCollectionResponse;
  parentCollection: ResourceCollectionResponse | null;
  childCollections: ResourceCollectionResponse[];
};

const MissionDetail = ({ collection, parentCollection, childCollections }: Props) => {
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
      title: collection.title_prefix || '',
      path: `/mission-details/${collection.resource_id}`,
    });

    setItems(breadcrumbItems);
    return () => {
      setItems([]);
    };
  }, []);

  useEffect(() => {
    const videoResource = getVideoResource(
      collection,
      childCollections,
    );
    setVideoResource(videoResource);
  }, []);

  const handleCollectionSelect = (collectionIndex: number) => {
    setSelectedCollectionIndex(collectionIndex);
  };

  const selectedCollection = useMemo(
    () => childCollections[selectedCollectionIndex],
    [childCollections, selectedCollectionIndex]
  );

  return (
    <div className="w-full flex flex-col gap-6 px-4 xl:px-0 pb-[60px]">
      <h1 className="text-2xl lg:text-[40px] lg:leading-[52px] text-[#333333]">{collection.title_prefix}</h1>

      <Banner
        videoResource={videoResource}
        title={[collection.title_prefix, collection.title].filter(Boolean).join(' : ')}
      />

      <div className="w-full flex flex-col md:flex-row gap-8 p-3 bg-[#EAF0FC] rounded-[16px]">
        <div className="w-full md:w-1/4">
          <Sidebar
            collections={childCollections}
            selectedCollectionIndex={selectedCollectionIndex}
            onCollectionSelect={handleCollectionSelect}
          />
        </div>

        <div className="w-full md:w-3/4">
          <CollectionDetail collection={selectedCollection} />
        </div>
      </div>

    </div>
  );
};

export default MissionDetail;

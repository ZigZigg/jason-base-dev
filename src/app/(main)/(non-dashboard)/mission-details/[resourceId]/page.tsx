import { Metadata } from 'next';
import { Suspense } from 'react';

import LoadingResourceDetail from '@/app/components/Modules/ModuleDetails/Loading';
import { getCollectionById, getResourceById } from '@/app/lib/modules/resource/data';
import MissionDetail from '@/features/mission_detail/components/MissionDetail';

type Props = {
  params: Promise<{
    resourceId: string;
  }>;
};

type PropMeta = {
  params: Promise<{
    resourceId: string
  }>,
}

// Generate dynamic metadata based on resource name
export async function generateMetadata({ params }: PropMeta): Promise<Metadata> {
  // Get the resource ID from params
  const { resourceId } = await params;

  const resource = await getResourceById(resourceId);
  if(!resource) {
    return {
      title: `Resource Not Found`,
      description: `Resource Not Found`,
    };
  }

  return {
    title: `${resource.title} | Jason Learning`,
    description: resource.description,
  };
}

export default async function ResourceDetailsPage({ params }: Props) {
  const { resourceId } = await params;
  const resource = await getResourceById(resourceId);
  const collection = await getCollectionById(resource.resource_collection_id)
  const parentCollection = collection.parent_id ? await getCollectionById(collection.parent_id) : null;
  const childCollections = collection.child_collections ? await Promise.all(
    collection.child_collections.map((child) => getCollectionById(child.id)
  )) : []

  return (
    <div className="w-full xl:w-[1280px]">
        <Suspense fallback={<LoadingResourceDetail />}>
          <MissionDetail
            collection={collection}
            parentCollection={parentCollection}
            childCollections={childCollections}
          />
        </Suspense>
    </div>
  );
}

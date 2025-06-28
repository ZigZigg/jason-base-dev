import {
  extractCollectionId,
  getCollectionById,
  getResourceById,
} from '@/lib/modules/resource/data';
import React from 'react';
import MissionDetail from './MissionDetail';

type Props = {
  resourceId: string;
};

const MainMissionDetail = async (props: Props) => {
  const { resourceId } = props;
  const resource = await getResourceById(resourceId);
  const collectionId = extractCollectionId(resource.links.resource_collection);
  const collection = await getCollectionById(collectionId);

  const parentCollection = collection.parent_id
    ? await getCollectionById(collection.parent_id)
    : null;

  const childCollections = collection.child_collections?.length
    ? await Promise.all(collection.child_collections.map((child) => getCollectionById(child.id)))
    : [collection];
  return (
    <MissionDetail
      collection={collection}
      parentCollection={parentCollection}
      childCollections={childCollections}
    />
  );
};

export default MainMissionDetail;

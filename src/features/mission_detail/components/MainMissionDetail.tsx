import { ResourceCollectionResponse } from '@/lib/interfaces/resource';
import {
  extractCollectionId,
  getCollectionById,
  getResourceById,
  groupAssociatedResourcesByType
} from '@/lib/modules/resource/data';
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

  let sideBarCollections: ResourceCollectionResponse[] = [];
  if (collection.child_collections?.length) {
    sideBarCollections = await Promise.all(collection.child_collections.map((child) => getCollectionById(child.id)));
  } else if (collection.associated_resources?.length) {
    sideBarCollections = groupAssociatedResourcesByType(collection.associated_resources || [], collection.id);
  }

  sideBarCollections = sideBarCollections.filter((sideBarCollection) => sideBarCollection.resource_id !== collection.resource_id && sideBarCollection.associated_resources?.length);

  return (
    <MissionDetail
      collection={collection}
      parentCollection={parentCollection}
      sideBarCollections={sideBarCollections}
    />
  );
};

export default MainMissionDetail;

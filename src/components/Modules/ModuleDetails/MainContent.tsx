import {
  getGroupListVideosByResourceId,
  getListSubCollectionsByResourceId,
} from '@/lib/modules/resource/data';
import { redirect } from 'next/navigation';
import SubCollection from '../SubCollection/SubCollection';
import ClientMainContent from './ClientMainContent';

type Props = {
  id: string;
  parentSubject: {
    id: number;
    name: string;
  };
};

const MainContentResource = async ({ id, parentSubject }: Props) => {
  // Get allowed IDs from environment variable
  const allowedIds = process.env.NEXT_PUBLIC_FIX_PLAYWATCH_IDS?.split(',') || [];
  const allowedIds2ndLayer = process.env.NEXT_PUBLIC_FIX_2ND_LAYER_PLAYWATCH_IDS?.split(',') || [];
  // Check if current ID is in the allowed list
  if (!allowedIds.includes(id) && !allowedIds2ndLayer.includes(id)) {
    const result = await getListSubCollectionsByResourceId(parseInt(id));

    // Redirect to mission-details if type is ASSOCIATE_COLLECTION
    if (result.type === 'ASSOCIATE_COLLECTION') {
      redirect(`/mission-details/${result.id}`);
    }

    return <SubCollection module={result} parentSubject={parentSubject} />;
  }

  // If ID is allowed, fetch data on the server
  const resource = await getGroupListVideosByResourceId(id);

  return <ClientMainContent initialData={resource} parentSubject={parentSubject} />;
};

export default MainContentResource;

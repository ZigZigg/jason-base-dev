import React from 'react';
import { getListSubCollectionsByResourceId, getListVideosByResourceId } from '@/app/lib/modules/resource/data';
import ClientMainContent from './ClientMainContent';
import SubCollection from '../SubCollection/SubCollection';

type Props = {
  id: string;
  parentSubject:{
    id: number;
    name: string;
  }
}



const MainContentResource = async ({ id, parentSubject }: Props) => {

  // Get allowed IDs from environment variable
  const allowedIds = process.env.NEXT_PUBLIC_FIX_PLAYWATCH_IDS?.split(',') || [];
  const allowedIds2ndLayer = process.env.NEXT_PUBLIC_FIX_2ND_LAYER_PLAYWATCH_IDS?.split(',') || [];
  // Check if current ID is in the allowed list
  if (!allowedIds.includes(id) && !allowedIds2ndLayer.includes(id)) {
    const result = await getListSubCollectionsByResourceId(id);

    return (
      <SubCollection module={result} parentSubject={parentSubject} />
    );
  }
  
  // If ID is allowed, fetch data on the server
  const resource = await getListVideosByResourceId(id);
  
  return (
    <ClientMainContent initialData={resource} parentSubject={parentSubject} />
  );
};

export default MainContentResource;
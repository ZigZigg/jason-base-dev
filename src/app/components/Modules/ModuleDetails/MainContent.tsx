import React from 'react';
import { getListVideosByResourceId } from '@/app/lib/modules/resource/data';
import ClientMainContent from './ClientMainContent';
import { Empty } from 'antd';

type Props = {
  id: string;
}

const MainContentResource = async ({ id }: Props) => {
  // Get allowed IDs from environment variable
  const allowedIds = process.env.NEXT_PUBLIC_FIX_PLAYWATCH_IDS?.split(',') || [];
  const allowedIds2ndLayer = process.env.NEXT_PUBLIC_FIX_2ND_LAYER_PLAYWATCH_IDS?.split(',') || [];
  // Check if current ID is in the allowed list
  if (!allowedIds.includes(id) && !allowedIds2ndLayer.includes(id)) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full">
        <Empty description="Navigation design in-progress" />
      </div>
    );
  }
  
  // If ID is allowed, fetch data on the server
  const resource = await getListVideosByResourceId(id);
  
  return (
    <ClientMainContent initialData={resource} />
  );
};

export default MainContentResource;
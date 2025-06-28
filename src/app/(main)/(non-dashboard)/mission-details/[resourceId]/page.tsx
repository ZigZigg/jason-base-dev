import { Metadata } from 'next';
import { Suspense } from 'react';

import LoadingResourceDetail from '@/components/Modules/ModuleDetails/Loading';
import { getResourceById } from '@/lib/modules/resource/data';
import MainMissionDetail from '@/features/mission_detail/components/MainMissionDetail';

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

  return (
    <div className="w-full xl:w-[1280px]">
        <Suspense fallback={<LoadingResourceDetail />}>
          <MainMissionDetail resourceId={resourceId} />
        </Suspense>
    </div>
  );
}

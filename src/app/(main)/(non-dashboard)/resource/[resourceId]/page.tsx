import { Suspense } from 'react';
import LoadingResourceDetail from '@/app/components/Modules/ModuleDetails/Loading';
import MainContentResource from '@/app/components/Modules/ModuleDetails/MainContent';
import { Metadata } from 'next';
import { getResourceById } from '@/app/lib/modules/resource/data';

type Props = {
  params: Promise<{
    resourceId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type PropMeta = {
  params: Promise<{
    resourceId: string
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

export default async function ResourceDetailsPage({ params, searchParams }: Props) {
  const { resourceId } = await params;
  const { parentSubjectId, parentSubjectName } = await searchParams;

  const parentSubjectIdNumber = parseInt(parentSubjectId as string) || 0;
  const parentSubjectNameString = (parentSubjectName as string) || '';

  return (
    <div className="w-full xl:w-[1280px]">
        <Suspense fallback={<LoadingResourceDetail />}>
          <MainContentResource
            id={resourceId}
            parentSubject={{ id: parentSubjectIdNumber, name: parentSubjectNameString }}
          />
        </Suspense>
    </div>
  );
}

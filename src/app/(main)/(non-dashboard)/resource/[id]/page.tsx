import { Suspense } from 'react';
import LoadingResourceDetail from '@/app/components/Modules/ModuleDetails/Loading';
import MainContentResource from '@/app/components/Modules/ModuleDetails/MainContent';
import { Metadata } from 'next';
import { getResourceById } from '@/app/lib/modules/resource/data';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type PropMeta = {
  params: Promise<{
    id: string
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate dynamic metadata based on subject name
export async function generateMetadata({ params }: PropMeta): Promise<Metadata> {
  // Get the subject ID from params
  const { id:resourceId } = await params;

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

export default async function SubjectDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { parentSubjectId, parentSubjectName } = await searchParams;

  const parentSubjectIdNumber = parseInt(parentSubjectId as string) || 0;
  const parentSubjectNameString = (parentSubjectName as string) || '';

  return (
    <div className="w-full xl:w-[1280px]">
      <div
        id="resource-container"
        className="flex flex-col md:flex-row gap-[40px] relative px-[16px] xl:px-[0px]"
      >
        <Suspense fallback={<LoadingResourceDetail />}>
          <MainContentResource
            id={id}
            parentSubject={{ id: parentSubjectIdNumber, name: parentSubjectNameString }}
          />
        </Suspense>
      </div>
    </div>
  );
}

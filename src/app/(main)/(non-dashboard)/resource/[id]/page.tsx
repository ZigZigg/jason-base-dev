import { Suspense } from 'react';
import LoadingResourceDetail from '@/app/components/Modules/ModuleDetails/Loading';
import MainContentResource from '@/app/components/Modules/ModuleDetails/MainContent';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

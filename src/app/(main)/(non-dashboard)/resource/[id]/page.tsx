

import { Suspense } from 'react';
import LoadingResourceDetail from '@/app/components/Modules/ModuleDetails/Loading';
import MainContentResource from '@/app/components/Modules/ModuleDetails/MainContent';


type Props = {
  params: Promise<{
    id: string
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default async function SubjectDetailsPage({params}: Props) {
  const { id } = await params;



  return (
    <div className="w-full xl:w-[1280px]">
      
      <div id='resource-container' className="flex flex-col md:flex-row gap-[40px] relative px-[16px] xl:px-[0px]">
        <Suspense fallback={<LoadingResourceDetail />}>
          <MainContentResource id={id} />
        </Suspense>
        

      </div>
    </div>
  );
} 
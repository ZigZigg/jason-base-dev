import LoadingResourceDetail from '@/components/Modules/ModuleDetails/Loading'
import MultimediaContent from '@/components/Modules/MultimediaContentDetail/MultimediaContent'
import { getResourceById } from '@/lib/modules/resource/data'
import { Metadata } from 'next'
import React, { Suspense } from 'react'


interface ResourceDetailPageProps {
  params: Promise<{
    contentId: string,
    resourceId: string
  }>
}
type PropMeta = {
  params: Promise<{
    contentId: string
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export async function generateMetadata({ params }: PropMeta): Promise<Metadata> {
  // Get the resource ID from params
  const { contentId } = await params;

  const resource = await getResourceById(contentId);
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

const ResourceDetailPage = async ({ params }: ResourceDetailPageProps) => {
  const { contentId, resourceId } = await params
  
  return (
    <div className="w-full xl:w-[1280px]">
        <Suspense fallback={<LoadingResourceDetail />}>
          <MultimediaContent contentId={contentId} resourceId={resourceId} />
        </Suspense>
    </div>
  )
}

export default ResourceDetailPage
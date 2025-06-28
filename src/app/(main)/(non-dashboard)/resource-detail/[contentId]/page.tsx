import LoadingResourceDetail from '@/components/Modules/ModuleDetails/Loading'
import MultimediaContent from '@/components/Modules/MultimediaContentDetail/MultimediaContent'
import React, { Suspense } from 'react'


interface ResourceDetailPageProps {
  params: Promise<{
    contentId: string,
    resourceId: string
  }>
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
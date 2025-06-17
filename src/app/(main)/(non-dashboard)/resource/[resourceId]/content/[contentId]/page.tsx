import LoadingResourceDetail from '@/app/components/Modules/ModuleDetails/Loading'
import MultimediaContent from '@/app/components/Modules/MultimediaContentDetail/MultimediaContent'
import React, { Suspense } from 'react'
import './jason-resources.scss'

interface ContentResourcePageProps {
  params: Promise<{
    contentId: string,
    resourceId: string
  }>
}

const ContentResourcePage = async ({ params }: ContentResourcePageProps) => {
  const { contentId, resourceId } = await params
  
  return (
    <div className="w-full xl:w-[1280px]">
        <Suspense fallback={<LoadingResourceDetail />}>
          <MultimediaContent contentId={contentId} resourceId={resourceId} />
        </Suspense>
    </div>
  )
}

export default ContentResourcePage
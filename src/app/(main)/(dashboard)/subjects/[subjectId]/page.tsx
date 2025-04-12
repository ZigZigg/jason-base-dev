import CategoryTabs from '@/app/components/Modules/Subjects/CategoryTabs'
import SubjectModuleContent from '@/app/components/Modules/Subjects/Content'
import FilteringSubject from '@/app/components/Modules/Subjects/Filtering'
import React from 'react'
import { getSubjectById, getSubjectResources } from '@/app/lib/modules/subjects/data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { mockThumbnail } from '../page'

type Props = {
  params: Promise<{
    subjectId: string
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate dynamic metadata based on subject name
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get the subject ID from params
  const { subjectId } = await params;
  const id = parseInt(subjectId);
  
  // Get the subject data
  const subject = await getSubjectById(id);
  
  if (!subject) {
    return {
      title: 'Subject Not Found',
    };
  }
  
  return {
    title: `${subject.name} | Jason Learning`,
    description: `Explore educational resources for ${subject.name}`,
  };
}

const SubjectModulePage = async ({ params, searchParams }: Props) => {
  // Get the subject ID from params
  const { subjectId } = await params;
  const currentSearchParams = await searchParams;
  const id = parseInt(subjectId);

  // Fetch the subject data
  const subject = id === 0 ? {
    name: 'All',
    id: 0
  } : await getSubjectById(id);
  
  // If subject doesn't exist, return 404
  if (!subject) {
    notFound();
  }
  
  // Get sort parameter from URL or use default
  const sortBy = currentSearchParams.sort_by as string || 'created_at:desc';
  
  // Fetch subject resources with sort parameter
  const { resources, subjects, pagination } = await getSubjectResources(id, sortBy);
    
  // Create initial pagination info from the response
  const initialPagination = {
    currentPage: 1,
    lastPage: pagination.lastPage, // Estimate based on 12 per page if not provided
    total: pagination.total
  };
  
  return (
    <div className='w-full flex flex-col flex-1 min-w-0'>
      <CategoryTabs activeId={id} subjects={subjects} />
      <div 
        className="aspect-[343/100] md:aspect-[1200/150] rounded-[16px] my-[24px] w-full relative"
        style={{
          backgroundImage: `url(${mockThumbnail[id as keyof typeof mockThumbnail]?.banner || '/assets/subjects/default-banner.jpg'})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <span className="font-[700] text-[20px] xl:text-[40px] leading-[120%] text-white ml-[16px] md:ml-[64px]">
            Explore {subject.id === 0 ? 'All Playwatch Resources' : subject.name}
          </span>
        </div>
      </div>
      <FilteringSubject count={pagination.total} />
      <SubjectModuleContent 
        resources={resources} 
        subjectName={subject.name}
        initialPagination={initialPagination}
        sortBy={sortBy}
      />
    </div>
  )
}

export default SubjectModulePage
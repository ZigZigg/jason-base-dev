import CategoryTabs from '@/app/components/Modules/Subjects/CategoryTabs'
import SubjectModuleContent from '@/app/components/Modules/Subjects/Content'
import FilteringSubject from '@/app/components/Modules/Subjects/Filtering'
import React from 'react'
import { getSubjectById, getSubjectResources } from '@/app/lib/modules/subjects/data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    subjectId: string
  }>
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

const SubjectModulePage = async ({ params }: Props) => {
  // Get the subject ID from params
  const { subjectId } = await params;
  const id = parseInt(subjectId);
  
  // Fetch the subject data
  const subject = await getSubjectById(id);
  
  // If subject doesn't exist, return 404
  if (!subject) {
    notFound();
  }
  
  // Fetch subject resources
  const { resources, subjects } = await getSubjectResources(id);
  
  return (
    <div className='w-full flex flex-col flex-1 min-w-0'>
      <CategoryTabs activeId={id} subjects={subjects} />
      <div 
        className="aspect-[343/100] md:aspect-[1200/150] rounded-[16px] my-[24px] w-full relative"
        style={{
          backgroundImage: "url('https://i.pinimg.com/originals/02/ba/86/02ba867e545f953631148c89629412b1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <span className="font-[700] text-[20px] md:text-[40px] leading-[120%] text-white ml-[16px] md:ml-[64px]">
            Explore {subject.name}
          </span>
        </div>
      </div>
      <FilteringSubject count={resources.length} />
      <SubjectModuleContent resources={resources} />
    </div>
  )
}

export default SubjectModulePage
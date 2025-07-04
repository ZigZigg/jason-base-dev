import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './page.module.scss';
import { getSubjectData } from '@/lib/modules/subjects/data';
import { Metadata } from 'next';
import { mockThumbnail } from '@/components/Modules/Subjects/subjectData';

export const metadata: Metadata = {
  title: 'Subject Categories | Jason Learning',
  description: 'Explore our range of educational subject categories',
};



const SubjectPage = async () => {
  // Fetch subjects data from the API
  const subjectData = await getSubjectData();


  // Handle empty state
  if (!subjectData || subjectData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold mb-2">No subjects found</h2>
        <p className="text-gray-500">Subject categories will appear here once available.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-[16px] md:gap-[24px] ${styles.container}`}>
      {subjectData.map((subject) => (
        <Link href={`/subjects/${subject.id}`} key={subject.id} className="block">
          <div className="w-full rounded-[16px] md:rounded-[24px] flex flex-col transition-transform hover:scale-[1.03] cursor-pointer">
            <Image
              src={mockThumbnail[subject.id as keyof typeof mockThumbnail].image || '/assets/subjects/subject-category.webp'}
              alt={`${subject.name} image`}
              width={384}
              height={142}
              sizes="(max-width: 768px) 163px, 384px"
              className="aspect-[163/100] md:aspect-[384/142] rounded-t-[16px] md:rounded-t-[24px] object-cover w-full"
              priority={subject.id <= 4} // Only prioritize first 4 images
            />
            <div style={{borderBottom: '8px solid #E49A29'}} className="w-full h-[45px] md:h-[62px] flex justify-center items-center bg-[#FDAC30] rounded-b-[16px] md:rounded-b-[24px]">
              <span className="text-[14px] xl:text-[20px] font-[800] text-white text-center">
                {subject.name}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubjectPage;

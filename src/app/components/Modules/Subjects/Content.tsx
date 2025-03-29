"use client";
import React from 'react';
import SubjectItem from './SubjectItem';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';

interface SubjectModuleContentProps {
  resources: ResourceCollection[];
}

const SubjectModuleContent = ({ resources = [] }: SubjectModuleContentProps) => {
  if (!resources || resources.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-gray-500">No resources available for this subject.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:gap-x-[32px] gap-y-[24px] md:gap-y-[24px]">
      {resources.map((resource) => (
        <SubjectItem 
          key={resource.id} 
          item={{
            id: parseInt(resource.id) || 0,
            imageUrl: '/assets/subject-category.webp',
            label: resource.title,
            moduleCounts: resource.subjects.length || 0,
            videoCounts: resource.assets.length || 0
          }} 
        />
      ))}
    </div>
  );
};

export default SubjectModuleContent;
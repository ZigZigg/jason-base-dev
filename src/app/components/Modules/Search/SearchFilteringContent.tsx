'use client';

import BaseButton from '@/app/atomics/button/BaseButton';
import BaseSearchBar from '@/app/atomics/input/BaseSearchBar';
import SelectBox from '@/app/atomics/select/SelectBox';
import { useGrades } from '@/app/lib/hooks/useGrades';
import { useSubjects } from '@/app/lib/hooks/useSubjects';
import { SearchParams } from '@/app/lib/interfaces/search';

import { Alert, Skeleton } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFilteringContentProps {
  onSearch?: (searchParams: SearchParams) => void;
  initialParams?: SearchParams;
  isModelOpen?: boolean;
}

interface FilterItem {
  key: string;
  label: string;
  value: string;
}

const SearchFilteringContent = ({ onSearch, initialParams }: SearchFilteringContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for search form values
  const [searchQuery, setSearchQuery] = useState(
    initialParams?.search_text || searchParams.get('search_text') || ''
  );
  const [selectedGrade, setSelectedGrade] = useState(
    initialParams?.grades?.[0] || searchParams.get('grades[]') || ''
  );
  const [selectedSubject, setSelectedSubject] = useState(
    initialParams?.subjects?.[0] || searchParams.get('subjects[]') || ''
  );
  const [hasError, setHasError] = useState(false);

  // Fetch data using our custom hooks
  const { grades, isLoading: isLoadingGrades, error: gradesError } = useGrades();
  const { subjects, isLoading: isLoadingSubjects, error: subjectsError } = useSubjects();

  // Check for errors
  useEffect(() => {
    if (gradesError || subjectsError) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [gradesError, subjectsError]);

  // Convert data to select options format
  const gradeOptions = [
    { title: 'All', value: '' },
    ...grades.map((grade) => ({
      title: grade.name,
      value: grade.name,
    })),
  ];

  const subjectOptions = [
    { title: 'All', value: '' },
    ...subjects.map((subject) => ({
      title: subject.name,
      value: subject.name,
    })),
  ];


  // Remove a specific filter
  const removeFilter = (filter: FilterItem) => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove the specified parameter
    params.delete(filter.key);
    
    // Update local state based on filter type
    if (filter.key === 'search_text') {
      setSearchQuery('');
    } else if (filter.key === 'grades[]') {
      setSelectedGrade('');
    } else if (filter.key === 'subjects[]') {
      setSelectedSubject('');
    }
    
    // Reset to page 1 when changing filters
    params.set('page', '1');
    
    // Navigate to the updated URL
    router.push(`/search?${params.toString()}`);
  };

  // Handle search form submission by updating URL parameters
  const handleSubmit = () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams();


    // Add search parameters if they exist
    if (searchQuery) params.set('search_text', searchQuery);
    if (selectedGrade) params.set('grades[]', selectedGrade);
    if (selectedSubject) params.set('subjects[]', selectedSubject);

    // Reset to page 1 when changing filters
    params.set('page', '1');

    // Build the URL
    const url = `/search?${params.toString()}`;

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch({
        search_text: searchQuery || undefined,
        grades: selectedGrade ? [selectedGrade] : undefined,
        subjects: selectedSubject ? [selectedSubject] : undefined,
        page: 1,
      });
    }

    // Navigate to the new URL
    router.push(url);
  };

  // Get the list of active filters
  const activeFilters = useMemo(() => {
    const filters: FilterItem[] = [];

    if (searchParams.get('search_text')) {
      filters.push({
        key: 'search_text',
        label: 'Search',
        value: searchQuery
      });
    }

    if (searchParams.get('grades[]')) {
      filters.push({
        key: 'grades[]',
        label: 'Grade',
        value: selectedGrade
      });
    }

    if (searchParams.get('subjects[]')) {
      filters.push({
        key: 'subjects[]',
        label: 'Subject',
        value: selectedSubject
      });
    }

    return filters;
  },[searchParams]) 

  return (
    <>
      {hasError && (
        <Alert
          message="Error"
          description="Failed to load filter options. Please try again later."
          type="error"
          showIcon
          className="mb-4"
          closable
        />
      )}
      <div className='pb-[14px] md:pb-[0px]'>
        <div className="flex flex-col md:flex-row xl:w-[1416px] gap-[20px] mb-[24px] px-[16px] md:px-[0px] pb-[24px] md:pb-[0px]">
          <div className="flex flex-col gap-[4px] flex-1">
            <span className="text-[#667085] text-[16px] font-[500]">Text Search</span>
            <BaseSearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex flex-col gap-[4px] w-full md:w-[180px] xl:w-[250px] flex-shrink-0">
            <span className="text-[#667085] text-[16px] font-[500]">Grades</span>
            {isLoadingGrades ? (
              <Skeleton.Input active size="large" className="w-full h-[56px]!" />
            ) : (
              <SelectBox
                placeholder="Select Grade(s)"
                options={gradeOptions}
                value={selectedGrade}
                onChange={setSelectedGrade}
              />
            )}
          </div>
          <div className="flex flex-col gap-[4px] w-full  md:w-[180px] xl:w-[250px] flex-shrink-0">
            <span className="text-[#667085] text-[16px] font-[500]">Subjects</span>
            {isLoadingSubjects ? (
              <Skeleton.Input active size="large" className="w-full h-[56px]!" />
            ) : (
              <SelectBox
                placeholder="Select Subject(s)"
                options={subjectOptions}
                value={selectedSubject}
                onChange={setSelectedSubject}
              />
            )}
          </div>
          <div className="flex items-end flex-shrink-0">
            <BaseButton
              type="default"
              className="md:flex! h-[56px]! w-full! md:w-auto!"
              customType="primaryActive"
              onClick={handleSubmit}
              disabled={isLoadingGrades || isLoadingSubjects}
            >
              Search
            </BaseButton>
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div id="selected-filters" className="flex flex-wrap gap-[8px] mb-4 px-[16px] md:px-[0px]">
            {activeFilters.map((filter) => (
              <div 
                key={filter.key} 
                className="flex items-center bg-[#F0F5FF] text-[#0F72F3] py-1 px-3 rounded-full text-sm border border-[#2867DC33]"
              >
                <span className="font-medium mr-1">{filter.label}:</span>
                <span>{filter.value}</span>
                <button 
                  onClick={() => removeFilter(filter)}
                  className="ml-2 flex items-center justify-center h-5 w-5 rounded-full hover:bg-[#E6EFFF] transition-colors"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3L9 9" stroke="#0F72F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
            
            {activeFilters.length && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('');
                  setSelectedSubject('');
                  router.push('/search');
                }}
                className="text-[#344054] text-sm font-medium cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchFilteringContent;

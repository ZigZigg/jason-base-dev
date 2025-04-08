import SearchContent from '@/app/components/Modules/Search/Content';
import SearchFiltering from '@/app/components/Modules/Search/Filtering';
import LoadingSearch from '@/app/components/Modules/Search/Loading';
import { SearchParams } from '@/app/lib/interfaces/search';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Search Resources | JASON Learning',
  description: 'Search for educational resources across various subjects and grade levels.',
};

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const currentSearchParams = await searchParams;
  // Convert URL params to our SearchParams interface
  const params: SearchParams = {
    search_text: currentSearchParams.search_text as string,
    page: currentSearchParams.page ? parseInt(currentSearchParams.page as string, 10) : 1,
    limit: currentSearchParams.limit ? parseInt(currentSearchParams.limit as string, 10) : 10,
    sort_by: (currentSearchParams.sort_by as string) || 'created_at:desc',
    grades: Array.isArray(currentSearchParams['grades[]'])
      ? (currentSearchParams['grades[]'] as string[])
      : currentSearchParams['grades[]']
      ? [currentSearchParams['grades[]'] as string]
      : [],
    subjects: Array.isArray(currentSearchParams['subjects[]'])
      ? (currentSearchParams['subjects[]'] as string[])
      : currentSearchParams['subjects[]']
      ? [currentSearchParams['subjects[]'] as string]
      : [],
  };

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center">
      <SearchFiltering initialParams={params} />

      <div className="w-full h-auto flex justify-center items-center bg-[#F5F5F2]">
        <Suspense fallback={<LoadingSearch />}>
          <SearchContent searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

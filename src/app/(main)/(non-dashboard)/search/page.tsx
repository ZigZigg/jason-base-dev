import SearchContent from '@/app/components/Modules/Search/Content'
import SearchFiltering from '@/app/components/Modules/Search/Filtering'
import { SearchParams, SearchResponse } from '@/app/lib/interfaces/search'
import { Metadata } from 'next'
import ApiClient from '@/app/lib/api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

export const metadata: Metadata = {
  title: 'Search Resources | JASON Learning',
  description: 'Search for educational resources across various subjects and grade levels.',
}

// Function to fetch search results directly from the Jason API using ApiClient
async function getSearchResults(searchParams: SearchParams): Promise<SearchResponse> {
  try {
    const session = await getServerSession(authOptions);
    const apiClient = new ApiClient(session?.accessToken);
    
    // Build the query string for the external API
    const queryParams = new URLSearchParams();
    if (searchParams.search_text) queryParams.append('search_text', searchParams.search_text);
    if (searchParams.page) queryParams.append('page', searchParams.page.toString());
    if (searchParams.limit) queryParams.append('limit', searchParams.limit.toString());
    if (searchParams.sort_by) queryParams.append('sort_by', searchParams.sort_by);
    
    // Add grades and subjects as array params
    searchParams.grades?.forEach(grade => {
      queryParams.append('grades[]', grade);
    });
    
    searchParams.subjects?.forEach(subject => {
      queryParams.append('subjects[]', subject);
    });

    // Return empty results if no search criteria provided
    if (!searchParams.grades?.length && !searchParams.subjects?.length && !searchParams.search_text) {
      return {
        current_page: 1,
        results: [],
        from: 0,
        last_page: 0,
        per_page: 10,
        to: 0,
        total: 0,
        initial_search: true
      };
    }
    // Use the ApiClient to make the request
    const result = await apiClient.get<SearchResponse>(`/v2/search_resources?exclude_collections=true&${queryParams.toString()}`, {
      next: { revalidate: 120 } // Cache for 60 seconds
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching search results:', error);
    // Return empty response with error status
    return {
      current_page: 1,
      results: [],
      from: 0,
      last_page: 0,
      per_page: 10,
      to: 0,
      total: 0
    };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: any
}) {
  const currentSearchParams = await searchParams
  // Convert URL params to our SearchParams interface
  const params: SearchParams = {
    search_text: currentSearchParams.search_text as string,
    page: currentSearchParams.page ? parseInt(currentSearchParams.page as string, 10) : 1,
    limit: currentSearchParams.limit ? parseInt(currentSearchParams.limit as string, 10) : 10,
    sort_by: currentSearchParams.sort_by as string || 'created_at:desc',
    grades: Array.isArray(currentSearchParams['grades[]']) ? currentSearchParams['grades[]'] as string[] : 
           currentSearchParams['grades[]'] ? [currentSearchParams['grades[]'] as string] : [],
    subjects: Array.isArray(currentSearchParams['subjects[]']) ? currentSearchParams['subjects[]'] as string[] : 
             currentSearchParams['subjects[]'] ? [currentSearchParams['subjects[]'] as string] : []
  };

  // Fetch search results
  const searchResults = await getSearchResults(params);

  return (
    <div className='w-full h-auto flex flex-col justify-center items-center'>
        <SearchFiltering initialParams={params} />
        <div className='w-full h-auto flex justify-center items-center bg-[#F5F5F2]'>
            <SearchContent searchResults={searchResults} />
        </div>
    </div>
  )
}
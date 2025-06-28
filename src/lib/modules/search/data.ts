import { getServerSession } from "next-auth";
import { SearchParams, SearchResponse } from "../../interfaces/search";
import { authOptions } from "../../auth";
import ApiClient from "../../api";

export async function getSearchResults(searchParams: SearchParams): Promise<SearchResponse> {
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
      searchParams.grades?.forEach((grade) => {
        queryParams.append('grades[]', grade);
      });
  
      searchParams.subjects?.forEach((subject) => {
        queryParams.append('subjects[]', subject);
      });
  
      // Return empty results if no search criteria provided
      if (
        !searchParams.grades?.length &&
        !searchParams.subjects?.length &&
        !searchParams.search_text
      ) {
        return {
          current_page: 1,
          results: [],
          from: 0,
          last_page: 0,
          per_page: 10,
          to: 0,
          total: 0,
          initial_search: true,
        };
      }
      // Use the ApiClient to make the request
      const result = await apiClient.get<SearchResponse>(
        `/v2/search_resources?exclude_collections=true&${queryParams.toString()}`,
        {
          next: { revalidate: 120 }, // Cache for 60 seconds
        }
      );
      const { results: currentResult } = result;
      const baseImageUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || ''; // Fallback URL
      // Process resources to extract thumbnails
      const processedResources = currentResult.map((resource) => {
        // Find the ThumbnailMedium asset if it exists
        const thumbnailAsset = resource.assets?.find(
          (asset) => asset.type?.name === 'ThumbnailMedium'
        );
  
        // Extract the thumbnail URL
          const thumbnail = thumbnailAsset?.file_uri
            ? thumbnailAsset.file_uri.startsWith('http')
              ? thumbnailAsset.file_uri
              : `${baseImageUrl}${thumbnailAsset.file_uri}`
            : undefined;
  
        // Return the resource with the extracted thumbnail
        return {
          ...resource,
          thumbnail,
        };
      });
      const data = {
        ...result,
        results: processedResources,
      };
      return data;
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
        total: 0,
      };
    }
  }
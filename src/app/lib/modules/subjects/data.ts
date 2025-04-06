import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import ApiClient from "../../api";

export interface SubjectData {
  id: number;
  name: string;
  is_top_level: boolean;
}

export interface ResourceAsset {
  id: number;
  type_id: number;
  name: string;
  path: string;
  file_uri: string;
  type: {
    id: number;
    name: string;
  }
}

export interface ResourceKeyword {
  id: number;
  name: string;
}

export interface ResourceGrade {
  id: number;
  name: string;
}

export interface ResourceSubject {
  id: number;
  name: string;
}

export interface ResourceType {
  id: number;
  name: string;
}

export interface ResourceStatus {
  id: number;
  name: string;
}

export interface ResourceCollection {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  status: ResourceStatus;
  assets: ResourceAsset[];
  thumbnail?: string;
  keywords: ResourceKeyword[];
  grades: ResourceGrade[];
  subjects: ResourceSubject[];
}

export interface ResourceCollectionResponse {
  results: ResourceCollection[];
  total: number;
  current_page: number;
  last_page: number;
}

export async function getSubjectData(): Promise<SubjectData[]> {
  const session = await getServerSession(authOptions);
  const apiClient = new ApiClient(session?.accessToken);

  try {
    const data = await apiClient.get<SubjectData[]>("/v2/subjects", { next: { revalidate: 1800 } });
    
    return data;
  } catch (error) {
    console.error("Error fetching subject data:", error);
    // Return empty array instead of throwing to handle gracefully in UI
    return [];
  }
}

export async function getSubjectById(subjectId: number): Promise<SubjectData | null> {
  const subjects = await getSubjectData();
  return subjects.find(subject => subject.id === subjectId) || null;
}

export async function getSubjectResources(
  subjectId: number, 
  sortBy: string = 'created_at:desc'
): Promise<{ subjects: SubjectData[], resources: ResourceCollection[], pagination: { currentPage: number, lastPage: number, total: number } }> {
  try {
    // First get the subject to obtain its name
    const subjects = await getSubjectData();
    const subject = subjects.find(subject => subject.id === subjectId);
    
    // If subject not found, return empty array
    if (!subject) {
      console.error(`Subject with ID ${subjectId} not found`);
      return {
        subjects: [],
        resources: [],
        pagination: {
          currentPage: 1,
          lastPage: 1,
          total: 0,
        },
      };
    }

    // Now use the subject name to fetch resources
    const session = await getServerSession(authOptions);
    const apiClient = new ApiClient(session?.accessToken);
    
    // Build URL with subject and sort parameters
    let url = `/v2/search_resource_collections?subjects[]=${encodeURIComponent(subject.name)}&page=1&per_page=12`;
    
    // Add sort parameter if provided
    if (sortBy) {
      url += `&sort_by=${encodeURIComponent(sortBy)}`;
    }

    const resources = await apiClient.get<ResourceCollectionResponse>(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    const result = resources?.results || [] ;
    const baseImageUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || ''; // Fallback URL
    // Process resources to extract thumbnails
    const processedResources = result.map(resource => {
      // Find the ThumbnailMedium asset if it exists
      const thumbnailAsset = resource.assets?.find(asset => 
        asset.type?.name === 'ThumbnailMedium'
      );
      
      // Extract the thumbnail URL
      const thumbnail = thumbnailAsset?.file_uri ? `${baseImageUrl}${thumbnailAsset?.file_uri}` : undefined;
      
      // Return the resource with the extracted thumbnail
      return {
        ...resource,
        thumbnail
      };
    });

    return {
      subjects,
      resources: processedResources,
      pagination: {
        currentPage: resources?.current_page || 1,
        lastPage: resources?.last_page || 1,
        total: resources?.total || 0,
      }
    };
  } catch (error) {
    console.error("Error fetching subject resources:", error);
    return {
      subjects: [],
      resources: [],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
      },
    };
  }
}
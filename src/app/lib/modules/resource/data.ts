import { getServerSession } from "next-auth";
import { ResourceAsset, ResourceCollection, ResourceType } from "../subjects/data";
import { authOptions } from "../../auth";
import ApiClient from "../../api";
import _ from "lodash";
export interface VideoResourceCollection {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    associated_resources?: ResourceAsset[];
    videoObject?: ResourceAsset;
    thumbnailObject?: ResourceAsset;
}


interface ResourceCollectionResponse {
    id: string;
    title?: string;
    description?: string;
    type?: ResourceType;
    child_collections?: { id: string }[];
    associated_resources?: ResourceAsset[];
}

// Extract collection ID from URL string
function extractCollectionId(url: string): string {
    const match = url.match(/\/([^\/]+)$/);
    return match ? match[1] : '';
}

export async function getListVideosByResourceId(resourceId: string): Promise<{results: VideoResourceCollection[], resource: ResourceCollection | null}> {
    try {
        const session = await getServerSession(authOptions);
        const apiClient = new ApiClient(session?.accessToken);
        
        const isSecondLayer = process.env.NEXT_PUBLIC_FIX_2ND_LAYER_PLAYWATCH_IDS?.split(',').includes(resourceId);

        // 1st layer: Get resource and extract collection ID from links
        const resourceUrl = `/v2/resources/${resourceId}`;
        const resourceResponse = await apiClient.get<ResourceCollection>(resourceUrl,{ next: { revalidate: 1800 } });

        
        if (!resourceResponse.links?.resource_collection) {
            throw new Error('Resource collection link not found');
        }
        
        const collectionId = extractCollectionId(resourceResponse.links.resource_collection);
        
        if (!collectionId) {
            throw new Error('Could not extract collection ID from link');
        }
        
        // 2nd layer: Get collection using the extracted ID
        const collectionUrl = `/v2/resource_collections/${collectionId}`;
        const collectionResponse = await apiClient.get<ResourceCollectionResponse>(collectionUrl,{ next: { revalidate: 1800 } });

        
        if (!collectionResponse.child_collections?.length) {
            throw new Error('No child collections found in the resource collection');
        }

        let subCollectionResponse = null
        if(!isSecondLayer){
            // Get first child collection ID
            const firstChildId = collectionResponse.child_collections[0].id;
            
            // 3rd layer: Get subcollection using the first child ID
            const subCollectionUrl = `/v2/resource_collections/${firstChildId}`;
            subCollectionResponse = await apiClient.get<ResourceCollectionResponse>(subCollectionUrl,{ next: { revalidate: 1800 } });
            
            if (!subCollectionResponse.child_collections?.length) {
                throw new Error('No child collections found in the subcollection');
            }

        }

        
        // 4th layer: Get associated resources from all child collections in parallel
        const childIds = isSecondLayer ? collectionResponse.child_collections.map(child => child.id) : (subCollectionResponse?.child_collections?.map(child => child.id) || []);
        
        // Use Promise.all for parallel requests to improve performance
        const childCollectionsPromises = childIds.map(id => 
            apiClient.get<ResourceCollectionResponse>(`/v2/resource_collections/${id}`,{ next: { revalidate: 1800 } })
        );
        
        const childCollections = await Promise.all(childCollectionsPromises);
        
        // Transform into the expected result format
        const results = childCollections
            .filter(collection => collection.title && collection.type) // Filter out invalid collections
            .map(collection => ({
                id: collection.id,
                title: collection.title || '',
                description: collection.description || '',
                type: collection.type as ResourceType,
                associated_resources: collection.associated_resources || []
            }));
        const baseImageUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || ''; // Fallback URL
        // Flat all associated_resources data using Lodash
        const videoResults = _.flatMap(results, 'associated_resources');

        const cleanVideoResults = videoResults
            .filter(resource => 
                resource.type?.name === 'Video' && 
                resource.assets?.some((asset: ResourceAsset) => asset.type?.mime_type === 'video/mp4')
            )
            .map(resource => {
                const videoObject = resource.assets?.find((asset: ResourceAsset) => asset.type?.mime_type === 'video/mp4');
                const thumbnailObject = resource.assets?.find((asset: ResourceAsset) => asset.type?.name === 'VideoPreviewImage');
                
                return {
                    ...resource,
                    videoObject:{
                        ...videoObject,
                        file_uri: `${baseImageUrl}${videoObject?.file_uri}`
                    },
                    thumbnailObject:{
                        ...thumbnailObject,
                        file_uri: `${baseImageUrl}${thumbnailObject?.file_uri}`
                    }
                };
            });
        
        return { results: cleanVideoResults || [], resource: resourceResponse };
    } catch (error) {
        console.error('Error fetching list videos by resource id:', error);
        return { results: [], resource: null };
    }
}
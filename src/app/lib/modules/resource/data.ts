import { getServerSession } from 'next-auth';
import { ResourceAsset, ResourceCollection, ResourceType } from '../subjects/data';
import { authOptions } from '../../auth';
import ApiClient from '../../api';
import _ from 'lodash';
import { terminalTypes } from './terminalTypes';

export interface SubCollectionObjectResponse {
  id: string;
  banner?: string;
  title: string;
  description?: string;
  type: CollectionResponseType;
  data: SubCollectionItem[];
}

export type CollectionResponseType = 'SUB_COLLECTION' | 'ASSOCIATE_COLLECTION';

export interface SubCollectionItem {
  title?: string;
  description?: string;
  type?: ResourceType;
  thumbnail?: string;
}
export interface SubCollectionResponse {
  results: SubCollectionItem[];
  type: CollectionResponseType;
}

export interface VideoResourceCollection {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  associated_resources?: ResourceAsset[];
  videoObject?: ResourceAsset;
  thumbnailObject?: ResourceAsset;
}

// Extended ResourceAsset with optional assets property for nested resources
interface ExtendedResourceAsset extends ResourceAsset {
  assets?: ResourceAsset[];
}

interface ChildCollection {
  id: string;
  title?: string;
  title_prefix?: string;
  description?: string;
  type?: ResourceType;
  resource?: ResourceCollection;
  thumbnail?: string;
}

interface ResourceCollectionResponse {
  id: string;
  title?: string;
  description?: string;
  type?: ResourceType;
  child_collections?: ChildCollection[];
  associated_resources?: ExtendedResourceAsset[];
  resource?: ResourceCollection;
}

// Extract collection ID from URL string
function extractCollectionId(url: string): string {
  const match = url.match(/\/([^\/]+)$/);
  return match ? match[1] : '';
}

export async function getListSubCollectionsByResourceId(
  resourceId: string
): Promise<SubCollectionObjectResponse> {
  try {
    const session = await getServerSession(authOptions);
    const apiClient = new ApiClient(session?.accessToken);
    const baseImageUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || '';

    // 1st layer: Get resource and extract collection ID from links
    const resourceUrl = `/v2/resources/${resourceId}`;
    const resourceResponse = await apiClient.get<ResourceCollection>(resourceUrl, {
      next: { revalidate: 1800 },
    });

    if (!resourceResponse.links?.resource_collection) {
        let bannerLink = undefined;
        // Look for thumbnail asset
        const bannerAsset = resourceResponse?.assets.find(
          (asset: ResourceAsset) => asset.type?.name === 'DefaultImage'
        );
    
        if (bannerAsset && bannerAsset.file_uri) {
            bannerLink = `${baseImageUrl}${bannerAsset.file_uri}`;
        }

        return {
            id: resourceId,
            data: [],
            type: 'SUB_COLLECTION',
            title: resourceResponse.title || '',
            description: resourceResponse.description || '',
            banner: bannerLink,
        }
    }

    const collectionId = extractCollectionId(resourceResponse.links.resource_collection);

    if (!collectionId) {
      throw new Error('Could not extract collection ID from link');
    }

    // 2nd layer: Get collection using the extracted ID
    const collectionUrl = `/v2/resource_collections/${collectionId}`;
    const collectionResponse = await apiClient.get<ResourceCollectionResponse>(collectionUrl, {
      next: { revalidate: 1800 },
    });
    let banner = undefined;
    // Look for thumbnail asset
    const bannerAsset = collectionResponse.resource?.assets.find(
      (asset: ResourceAsset) => asset.type?.name === 'BannerMedium'
    );

    if (bannerAsset && bannerAsset.file_uri) {
      banner = `${baseImageUrl}${bannerAsset.file_uri}`;
    }
    // Check if collection has child collections
    if (collectionResponse.child_collections && collectionResponse.child_collections.length > 0) {
      const processedCollections = collectionResponse.child_collections.map((child) => {
        let thumbnail = undefined;

        // Find thumbnail from resource if available
        if (child.resource && child.resource.assets && child.resource.assets.length > 0) {
          // Look for thumbnail asset
          const thumbnailAsset = child.resource.assets.find(
            (asset: ResourceAsset) => asset.type?.name === 'ThumbnailMedium'
          );

          if (thumbnailAsset && thumbnailAsset.file_uri) {
            thumbnail = `${baseImageUrl}${thumbnailAsset.file_uri}`;
          }
        }

        return {
          ...child,
          title: child.title_prefix ? `${child.title_prefix} - ${child.title}` : child.title,
          description: child.description || child.resource?.description || '',
          thumbnail,
        };
      });

      return {
        id: resourceId,
        data: processedCollections,
        type: 'SUB_COLLECTION',
        title: collectionResponse.title || '',
        description:
          collectionResponse.description || collectionResponse.resource?.description || '',
        banner: banner,
      };
    }
    // If no child collections but has associated resources
    else if (
      collectionResponse.associated_resources &&
      collectionResponse.associated_resources.length > 0
    ) {
      // Group by resource type
      const groupedByType = _.groupBy(
        collectionResponse.associated_resources,
        (resource) => resource.type?.name || 'Unknown'
      );

      // Convert to array of types with their resources
      const resourceTypes = Object.entries(groupedByType).map(([typeName, resources]) => ({
        title: resources[0]?.type?.friendly_name || typeName,
        description: terminalTypes[typeName].description || '',
      }));

      return {
        id: resourceId,
        data: resourceTypes,
        type: 'ASSOCIATE_COLLECTION',
        title: collectionResponse.title || '',
        description:
          collectionResponse.description || collectionResponse.resource?.description || '',
        banner: banner,
      };
    }

    // If no child collections and no associated resources
    return {
      id: resourceId,
      data: [],
      type: 'SUB_COLLECTION',
      title: collectionResponse.title || '',
      description: collectionResponse.description || collectionResponse.resource?.description || '',
      banner: banner,
    };
  } catch (error) {
    console.error('Error fetching list subcollections by resource id:', error);
    return { id: resourceId, data: [], type: 'SUB_COLLECTION', title: '' };
  }
}

export async function getListVideosByResourceId(
  resourceId: string
): Promise<{ results: VideoResourceCollection[]; resource: ResourceCollection | null }> {
  try {
    const session = await getServerSession(authOptions);
    const apiClient = new ApiClient(session?.accessToken);

    const isSecondLayer =
      process.env.NEXT_PUBLIC_FIX_2ND_LAYER_PLAYWATCH_IDS?.split(',').includes(resourceId);

    // 1st layer: Get resource and extract collection ID from links
    const resourceUrl = `/v2/resources/${resourceId}`;
    const resourceResponse = await apiClient.get<ResourceCollection>(resourceUrl, {
      next: { revalidate: 1800 },
    });

    if (!resourceResponse.links?.resource_collection) {
      throw new Error('Resource collection link not found');
    }

    const collectionId = extractCollectionId(resourceResponse.links.resource_collection);

    if (!collectionId) {
      throw new Error('Could not extract collection ID from link');
    }

    // 2nd layer: Get collection using the extracted ID
    const collectionUrl = `/v2/resource_collections/${collectionId}`;
    const collectionResponse = await apiClient.get<ResourceCollectionResponse>(collectionUrl, {
      next: { revalidate: 1800 },
    });

    if (!collectionResponse.child_collections?.length) {
      throw new Error('No child collections found in the resource collection');
    }

    let subCollectionResponse = null;
    if (!isSecondLayer) {
      // Get first child collection ID
      const firstChildId = collectionResponse.child_collections[0].id;

      // 3rd layer: Get subcollection using the first child ID
      const subCollectionUrl = `/v2/resource_collections/${firstChildId}`;
      subCollectionResponse = await apiClient.get<ResourceCollectionResponse>(subCollectionUrl, {
        next: { revalidate: 1800 },
      });

      if (!subCollectionResponse.child_collections?.length) {
        throw new Error('No child collections found in the subcollection');
      }
    }

    // 4th layer: Get associated resources from all child collections in parallel
    const childIds = isSecondLayer
      ? collectionResponse.child_collections.map((child) => child.id)
      : subCollectionResponse?.child_collections?.map((child) => child.id) || [];

    // Use Promise.all for parallel requests to improve performance
    const childCollectionsPromises = childIds.map((id) =>
      apiClient.get<ResourceCollectionResponse>(`/v2/resource_collections/${id}`, {
        next: { revalidate: 1800 },
      })
    );

    const childCollections = await Promise.all(childCollectionsPromises);

    // Transform into the expected result format
    const results = childCollections
      .filter((collection) => collection.title && collection.type) // Filter out invalid collections
      .map((collection) => ({
        id: collection.id,
        title: collection.title || '',
        description: collection.description || '',
        type: collection.type as ResourceType,
        associated_resources: collection.associated_resources || [],
      }));
    const baseImageUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || ''; // Fallback URL
    // Flat all associated_resources data using Lodash
    const videoResults = _.flatMap(results, 'associated_resources');

    const cleanVideoResults = videoResults
      .filter(
        (resource) =>
          resource.type?.name === 'Video' &&
          resource.assets?.some((asset: ResourceAsset) => asset.type?.mime_type === 'video/mp4')
      )
      .map((resource) => {
        const videoObject = resource.assets?.find(
          (asset: ResourceAsset) => asset.type?.mime_type === 'video/mp4'
        );
        const thumbnailObject = resource.assets?.find(
          (asset: ResourceAsset) => asset.type?.name === 'VideoPreviewImage'
        );

        return {
          ...resource,
          videoObject: {
            ...videoObject,
            file_uri: `${baseImageUrl}${videoObject?.file_uri}`,
          },
          thumbnailObject: {
            ...thumbnailObject,
            file_uri: `${baseImageUrl}${thumbnailObject?.file_uri}`,
          },
        };
      });

    return { results: cleanVideoResults || [], resource: resourceResponse };
  } catch (error) {
    console.error('Error fetching list videos by resource id:', error);
    return { results: [], resource: null };
  }
}

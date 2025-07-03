import _ from 'lodash';
import { getServerSession } from 'next-auth';

import { getVideoAssetFromAssociatedResources } from '@/selectors/video_asset_selector';
import ApiClient from '../../api';
import { authOptions } from '../../auth';
import {
  ResourceCollectionResponse,
  SubCollectionObjectResponse,
  VideoResourceCollection
} from '../../interfaces/resource';
import { ResourceAsset, ResourceCollection, ResourceType } from '../subjects/data';
import { terminalTypes } from './terminalTypes';

// Extract collection ID from URL string
export function extractCollectionId(url: string): string {

  if(!url) {
    return '';
  }
  const match = url.match(/\/([^\/]+)$/);
  return match ? match[1] : '';
}

export async function getResourceById(resourceId: string): Promise<ResourceCollection> {
  try {
    const session = await getServerSession(authOptions);
    const apiClient = new ApiClient(session?.accessToken);
    const resourceUrl = `/v2/resources/${resourceId}`;
    const resourceResponse = await apiClient.get<ResourceCollection>(resourceUrl, {
      next: { revalidate: 1800 },
    });

    return resourceResponse;
  } catch (error) {
    console.error(`Error fetching resource with ID ${resourceId}:`, error);
    throw error;
  }
}

export async function getCollectionById(collectionId: string): Promise<ResourceCollectionResponse> {
  try {
    const session = await getServerSession(authOptions);
    const apiClient = new ApiClient(session?.accessToken);
    const resourceUrl = `/v2/resource_collections/${collectionId}`;
    const resourceResponse = await apiClient.get<ResourceCollectionResponse>(resourceUrl, {
      next: { revalidate: 1800 },
    });

    return resourceResponse;
  } catch (error) {
    console.error(`Error fetching collection with ID ${collectionId}:`, error);

    throw error;
  }
}


export async function getListSubCollectionsByResourceId(
  resourceId: number
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
    const resourceContentHtmlFragment = resourceResponse?.html_fragments?.find((fragment) => fragment.type?.name === 'ResourceContent');

    if (!resourceResponse.links?.resource_collection) {
        let bannerLink = undefined;
        // Look for thumbnail asset
        const bannerAsset = resourceResponse?.assets.find(
          (asset: ResourceAsset) => asset.type?.name === 'DefaultImage'
        );

        if (bannerAsset && bannerAsset.file_uri) {
            bannerLink = bannerAsset.file_uri.startsWith('http')
              ? bannerAsset.file_uri
              : `${baseImageUrl}${bannerAsset.file_uri}`;

        }

        return {
            id: resourceId,
            data: [],
            type: 'SUB_COLLECTION',
            title: resourceResponse.title || '',
            description: resourceResponse.description || '',
            banner: bannerLink,
            resourceContentHtmlFragment,
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
      banner = bannerAsset.file_uri.startsWith('http')
        ? bannerAsset.file_uri
        : `${baseImageUrl}${bannerAsset.file_uri}`;
    }

    // Check if collection has child collections
    const currentTitle = collectionResponse.title_prefix ? `${collectionResponse.title_prefix} - ${collectionResponse.title}` : collectionResponse.title || '';
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
            thumbnail = thumbnailAsset.file_uri.startsWith('http')
              ? thumbnailAsset.file_uri
              : `${baseImageUrl}${thumbnailAsset.file_uri}`;
          }
        }

        return {
          ...child,
          title: child.title_prefix ? `${child.title_prefix} - ${child.title}` : child.title,
          description: child.description || child.resource?.description || '',
          thumbnail,
          sort_order: child.sort_order || 0,
        };
      }).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      return {
        id: resourceId,
        data: processedCollections,
        type: 'SUB_COLLECTION',
        title: currentTitle,
        description:
          collectionResponse.description || collectionResponse.resource?.description || '',
        banner: banner,
        videoAsset: getVideoAssetFromAssociatedResources(collectionResponse.associated_resources || []),
        resourceContentHtmlFragment,
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
        title: currentTitle,
        description:
          collectionResponse.description || collectionResponse.resource?.description || '',
        banner: banner,
        resourceContentHtmlFragment,
      };
    }

    // If no child collections and no associated resources
    return {
      id: resourceId,
      data: [],
      type: 'SUB_COLLECTION',
      title: currentTitle,
      description: collectionResponse.description || collectionResponse.resource?.description || '',
      banner: banner,
      resourceContentHtmlFragment,
    };
  } catch (error) {
    console.error('Error fetching list subcollections by resource id:', error);
    return { id: resourceId, data: [], type: 'SUB_COLLECTION', title: '' };
  }
}

export async function getGroupListVideosByResourceId(
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
      .map((collection) => {
        const associated_resources = collection.associated_resources?.map((resource) => {
          return {
            ...resource,
            parent_object:{
              id: collection.id,
              title: collection.title,
              title_prefix: collection.title_prefix,
            }
          }
        })
        return {
          id: collection.id,
          title: collection.title || '',
          description: collection.description || '',
          type: collection.type as ResourceType,
          associated_resources: associated_resources || [],
        }
      });
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

        // Find related TeachersGuide with "Discover" prefix
        const teacherGuide = videoResults.find(
          (guide) =>
            guide.type?.name === 'TeachersGuide' &&
            guide.title === `Discover ${resource.title}`
        );

        return {
          ...resource,
          videoObject: {
            ...videoObject,
            file_uri: videoObject?.file_uri.startsWith('http')
              ? videoObject?.file_uri
              : `${baseImageUrl}${videoObject?.file_uri}`,
          },
          thumbnailObject: {
            ...thumbnailObject,
            file_uri: thumbnailObject?.file_uri.startsWith('http')
              ? thumbnailObject?.file_uri
              : `${baseImageUrl}${thumbnailObject?.file_uri}`,
          },
          teacherGuide: teacherGuide
            ? {
                id: teacherGuide.id,
                title: teacherGuide.title,
              }
            : null,
        };
      });
      const currentResource = {
        ...resourceResponse,
        educator_resource: subCollectionResponse?.educator_resources?.length ? subCollectionResponse?.educator_resources[0] : null,
      }

    return { results: cleanVideoResults || [], resource: currentResource };
  } catch (error) {
    console.error('Error fetching list videos by resource id:', error);
    return { results: [], resource: null };
  }
}

const convertSingleHtmlContent = (htmlContent: string) => {
  // Pattern to match {{resource:link:resourceId}}
  const resourceLinkPattern = /\{\{resource:link:(\d+)\}\}/g;

  // Pattern to match {{resource:embed_image:resourceId}} and {{resource:embed_image:resourceId:size-medium}}
  const resourceEmbedImagePattern = /\{\{resource:embed_image:(\d+)(?::size-(?:small|medium|large))?\}\}/g;

  // <p>When you are done, be sure to complete the quiz for this lesson!</p>\n<p>{{resource:embed:46029}}</p>
  const resourceEmbedVideoPattern = /\{\{resource:embed:(\d+)\}\}/g;

  let convertedContent = htmlContent;

  // Replace all link patterns with placeholder divs that will be populated client-side
  convertedContent = convertedContent.replace(resourceLinkPattern, (match, resourceId) => {
    return `<div class="resource-link-placeholder inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded animate-pulse" data-resource-id="${resourceId}">
      <div class="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
      <span class="text-gray-500">Loading resource ${resourceId}...</span>
    </div>`;
  });

  // Replace all embed image patterns with placeholder divs that will be populated client-side
  convertedContent = convertedContent.replace(resourceEmbedImagePattern, (match, resourceId) => {
    return `<div class="resource-embed-image-placeholder flex items-center justify-center w-full h-48 bg-gray-100 rounded animate-pulse" data-resource-id="${resourceId}">
      <div class="flex flex-col items-center gap-2">
        <div class="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
        <span class="text-gray-500 text-sm">Loading image ${resourceId}...</span>
      </div>
    </div>`;
  });

  // Prepare placeholder for resource embeds
  convertedContent = convertedContent.replace(resourceEmbedVideoPattern, (match, resourceId) => {
    return `<div class="resource-embed-video-placeholder inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded animate-pulse" data-resource-id="${resourceId}">
      <div class="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
      <span class="text-gray-500">Loading embed video resource ${resourceId}...</span>
    </div>`;
  });

  // Pattern to match <img> tags and update relative src paths
  const imgPattern = /<img([^>]*)\ssrc="([^"]+)"([^>]*)>/g;
  convertedContent = convertedContent.replace(imgPattern, (match, beforeSrc, src, afterSrc) => {
    // Check if src starts with [CDNRoot]
    if (src.startsWith('[CDNRoot]')) {
      const fullSrc = src.replace('[CDNRoot]', process.env.NEXT_PUBLIC_ASSETS_ROOT_CDN || '');
      return `<img${beforeSrc} src="${fullSrc}"${afterSrc}>`;
    }
    // Check if src is already an absolute URL (starts with http)
    else if (src.startsWith('http')) {
      return match; // Keep as is
    } else {
      // It's a relative path, prepend with base URL
      const fullSrc = `${process.env.NEXT_PUBLIC_ASSETS_BASE_URL}${src}`;
      return `<img${beforeSrc} src="${fullSrc}"${afterSrc}>`;
    }
  });

  // Pattern to match <a> tags with data-resource-id and update href
  const linkPattern = /<a([^>]*)\sdata-resource-id="([^"]+)"([^>]*)>/g;
  convertedContent = convertedContent.replace(linkPattern, (match, beforeDataId, resourceId, afterDataId) => {
    // Check if href already exists and remove it to replace
    const cleanedBefore = beforeDataId.replace(/\s*href="[^"]*"/g, '');
    const cleanedAfter = afterDataId.replace(/\s*href="[^"]*"/g, '');

    // Add the new href
    return `<a${cleanedBefore} data-resource-id="${resourceId}" href="/resource-detail/${resourceId}"${cleanedAfter}>`;
  });

  // Pattern to match href="/ResourceDetails/<resourceId>/..." and update only the href value
  const resourceDetailsHrefPattern = /href="\/ResourceDetails\/(\d+)[^"]*"/g;
  convertedContent = convertedContent.replace(resourceDetailsHrefPattern, (match, resourceId) => {
    // Replace only the href value with the new format
    return `href="/resource-detail/${resourceId}"`;
  });

  return convertedContent;
};

export const getConvertedHtmlContent = (htmlFragments: any[]) => {
  try {
    return htmlFragments.map(fragment => ({
      ...fragment,
      content: convertSingleHtmlContent(fragment.content || '')
    }));
  } catch (error) {
    console.error('Error converting HTML content:', error);
    return htmlFragments; // Return original fragments on error
  }
}

export const groupAssociatedResourcesByType = (associatedResources: any[], collectionId: string): ResourceCollectionResponse[] => {
  if (!associatedResources?.length) {
    return [];
  }

  // Group by resource type
  const groupedByType = _.groupBy(
    associatedResources,
    (resource) => resource.type?.name || 'Unknown'
  );

  // Convert to array of types with their resources, structured like ResourceCollectionResponse
  const resourceTypes = Object.entries(groupedByType).map(([typeName, resources], index) => ({
    id: `${collectionId}-${typeName}-${index}`, // Generate unique ID
    parent_id: collectionId,
    resource_id: resources[0]?.id || null,
    title: resources[0]?.type?.friendly_name || typeName,
    title_prefix: '', // Empty as this represents a resource type group
    description: '',
    type: resources[0]?.type || null,
    resource: undefined,
    child_collections: [],
    associated_resources: resources,
    educator_resources: [],
  } as ResourceCollectionResponse));

  return resourceTypes;
}

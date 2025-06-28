import { ExtendedResourceAsset, ResourceCollectionResponse } from "@/app/lib/interfaces/resource";

export type TVideoResource = {
  file_uri: string;
  thumbnail_file_uri: string;
  description: string;
}
export const getVideoResource = (
  collection: ResourceCollectionResponse,
  childCollections: ResourceCollectionResponse[],
): TVideoResource | undefined => {
  const childAssociatedResourcesIds = childCollections.map((child) =>
    child.associated_resources?.map((childAssociatedResource) => childAssociatedResource.id) || []
  ).flat();
  const mainAssociatedResources = collection.associated_resources?.filter((associatedResource) => !childAssociatedResourcesIds.includes(associatedResource.id)) || [];

  const videoResource = mainAssociatedResources.find((resource) => resource.type.name === 'Video');

  const videoAsset = videoResource?.assets?.find((asset) => asset.type.name === 'iOSfriendlymp4')
  const videoThumbnail = videoResource?.assets?.find((asset) => asset.type.name === 'VideoPreviewImage')

  if (videoAsset && videoThumbnail) {
    return {
      file_uri: videoAsset.file_uri,
      thumbnail_file_uri: videoThumbnail.file_uri,
      description: videoResource?.description || '',
    }
  }

  return undefined;
}

export const getAssociatedResourceThumbnail = (
  associatedResource: ExtendedResourceAsset,
): string => {
  if (associatedResource.type.name === 'HostResearcher') {
    return 'https://assets.jason.org/common/resource_assets/thumbnails/hostresearcher/thumbnail_medium.png';
  }

  if (associatedResource.type.name === 'Article') {
    return 'https://assets.jason.org/common/resource_assets/thumbnails/article/thumbnail_medium.png';
  }

  if (associatedResource.type.name === 'Laboratory') {
    return 'https://assets.jason.org/common/resource_assets/thumbnails/laboratory/thumbnail_medium.png';
  }

  if (associatedResource.type.name === 'Video') {
    const videoThumbnail = associatedResource.assets?.find((asset) => asset.type.name === 'ThumbnailMedium');
    return videoThumbnail ? videoThumbnail.file_uri : '';
  }

  return '/assets/subject-category.webp';
}

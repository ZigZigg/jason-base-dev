import { ExtendedResourceAsset, ResourceCollectionResponse } from "@/lib/interfaces/resource";

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

  let videoResource = mainAssociatedResources.find((resource) => resource.type.name === 'Video');
  if (!videoResource) {
    videoResource = collection.associated_resources?.find((resource) => resource.type.name === 'Video');
  }

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
  const thumbnail = associatedResource.assets?.find((asset) => asset.type.name === 'ThumbnailMedium');
  if (thumbnail) {
    return thumbnail.file_uri;
  }

  return `https://assets.jason.org/common/resource_assets/thumbnails/${associatedResource.type.name.toLowerCase()}/thumbnail_medium.png`
}

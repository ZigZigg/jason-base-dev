import { ExtendedResourceAsset } from "@/lib/interfaces/resource";
import { ResourceAsset } from "@/lib/modules/subjects/data";

export type TVideoAsset = {
  video_display_name: string;
  video_file_uri: string;
  video_thumbnail_file_uri: string;
}

// Find first video asset in associated resources
export const getVideoAssetFromAssociatedResources = (associated_resources: ExtendedResourceAsset[]): TVideoAsset | undefined => {
  const videoResource = associated_resources.find((resource) => resource.type.name === 'Video' || resource.type.name === 'Audio');

  if (!videoResource) {
    return undefined;
  }

  return getVideoAssetFromAssets(videoResource.assets || []);
}

export const getVideoAssetFromAssets = (assets: ResourceAsset[]): TVideoAsset | undefined => {
  const videoAsset = assets.find((asset) => asset.type.name === 'iOSfriendlymp4')
  const videoThumbnail = assets.find((asset) => asset.type.name === 'VideoPreviewImage')

  if (videoAsset) {
    return {
      video_display_name: videoAsset.display_name || '',
      video_file_uri: videoAsset.file_uri,
      video_thumbnail_file_uri: videoThumbnail?.file_uri || '',
    }
  }

  return undefined;
}

import { ExtendedResourceAsset } from "@/app/lib/interfaces/resource";

export type TVideoAsset = {
  video_file_uri: string;
  video_thumbnail_file_uri: string;
}

// Find first video asset in associated resources
export const getVideoAsset = (associated_resources: ExtendedResourceAsset[]): TVideoAsset | undefined => {
  const videoResource = associated_resources.find((resource) => resource.type.name === 'Video' || resource.type.name === 'Audio');

  const videoAsset = videoResource?.assets?.find((asset) => asset.type.name === 'iOSfriendlymp4')
  const videoThumbnail = videoResource?.assets?.find((asset) => asset.type.name === 'VideoPreviewImage')

  if (videoAsset && videoThumbnail) {
    return {
      video_file_uri: videoAsset.file_uri,
      video_thumbnail_file_uri: videoThumbnail.file_uri,
    }
  }

  return undefined;
}

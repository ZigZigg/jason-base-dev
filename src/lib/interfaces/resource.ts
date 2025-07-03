import { TVideoAsset } from '@/selectors/video_asset_selector';
import { ResourceAsset, ResourceCollection, ResourceHtmlFragment, ResourceType } from '../modules/subjects/data';

export interface SubCollectionObjectResponse {
  id: number;
  banner?: string;
  title: string;
  description?: string;
  type: CollectionResponseType;
  data: SubCollectionItem[];
  videoAsset?: TVideoAsset;
  resourceContentHtmlFragment?: ResourceHtmlFragment;
}

export type CollectionResponseType = 'SUB_COLLECTION' | 'ASSOCIATE_COLLECTION';

export interface SubCollectionItem {
  resource_id?: string;
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
  parent_object?: {
    id: string;
    title: string;
    title_prefix?: string;
  }
  teacherGuide?: {
    id: string;
    title: string;
  }
}

// Extended ResourceAsset with optional assets property for nested resources
export interface ExtendedResourceAsset extends ResourceAsset {
  assets?: ResourceAsset[];
}

export interface ChildCollection {
  id: string;
  resource_id: string;
  title?: string;
  title_prefix?: string;
  description?: string;
  type?: ResourceType;
  resource?: ResourceCollection;
  thumbnail?: string;
  sort_order?: number;
}

export interface ResourceCollectionResponse {
  id: string;
  parent_id: string | null;
  resource_id: string;
  title?: string;
  title_prefix?: string;
  description?: string;
  type?: ResourceType;
  child_collections?: ChildCollection[];
  associated_resources?: ExtendedResourceAsset[];
  resource?: ResourceCollection;
  educator_resources?: ResourceCollection[];
}


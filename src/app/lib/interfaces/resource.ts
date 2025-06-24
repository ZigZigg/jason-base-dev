import { ResourceAsset, ResourceCollection, ResourceType } from '../modules/subjects/data';

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
  title?: string;
  title_prefix?: string;
  description?: string;
  type?: ResourceType;
  resource?: ResourceCollection;
  thumbnail?: string;
}

export interface ResourceCollectionResponse {
  id: string;
  title?: string;
  title_prefix?: string;
  description?: string;
  type?: ResourceType;
  child_collections?: ChildCollection[];
  associated_resources?: ExtendedResourceAsset[];
  resource?: ResourceCollection;
  educator_resources?: ResourceCollection[];
} 
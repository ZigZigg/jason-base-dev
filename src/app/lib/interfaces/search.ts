import { ResourceAsset } from "../modules/subjects/data";

// Base types used across the search interfaces
export interface GradeOption {
  id: number;
  name: string;
}

export interface SubjectOption {
  id: number;
  name: string;
}

// Individual search result item
export interface SearchResource {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  grades: GradeOption[];
  subjects: SubjectOption[];
  assets: ResourceAsset[]
}

// Paginated response structure
export interface SearchResponse {
  current_page: number;
  results: SearchResource[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  initial_search?: boolean;
}

// Search parameters for use in URLs and filters
export interface SearchParams {
  search_text?: string;
  grades?: string[];
  subjects?: string[];
  page?: number;
  limit?: number;
  sort_by?: string;
} 
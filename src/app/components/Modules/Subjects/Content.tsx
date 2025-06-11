'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import SubjectItem from './SubjectItem';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { Spin } from 'antd';
import { SubjectSkeletonGrid } from './SkeletonItem';

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

interface SubjectModuleContentProps {
  resources: ResourceCollection[];
  subjectName: string;
  subjectId: number;
  initialPagination?: PaginationInfo;
  sortBy?: string;
}

const SubjectModuleContent = ({
  resources = [],
  subjectName,
  subjectId,
  initialPagination = { currentPage: 1, lastPage: 1, total: 0 },
  sortBy = 'created_at:desc',
}: SubjectModuleContentProps) => {
  // State for resources and pagination
  const [allResources, setAllResources] = useState<ResourceCollection[]>(resources);
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Ref for the intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Tracking if there are more resources to load
  const hasMore = pagination.currentPage < pagination.lastPage;

  // Function to fetch more resources
  const fetchMoreResources = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const nextPage = pagination.currentPage + 1;
      const response = await fetch(
        `/api/subjects/resources?subject_name=${encodeURIComponent(
          subjectName
        )}&page=${nextPage}&sort_by=${encodeURIComponent(sortBy)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more resources: ${response.statusText}`);
      }

      const data = await response.json();
      const { results }: { results: ResourceCollection[] } = data;
      const baseImageUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL || ''; // Fallback URL
      // Process resources to extract thumbnails
      const processedResources = results
        .map((resource) => {
          // Find the ThumbnailMedium asset if it exists
          const thumbnailAsset = resource.assets?.find(
            (asset) => asset.type?.name === 'ThumbnailMedium'
          );

          // Extract the thumbnail URL
          const thumbnail = thumbnailAsset?.file_uri
            ? thumbnailAsset.file_uri.startsWith('http')
              ? thumbnailAsset.file_uri
              : `${baseImageUrl}${thumbnailAsset.file_uri}`
            : undefined;

          // Return the resource with the extracted thumbnail
          return {
            ...resource,
            thumbnail,
          };
        })
        .filter((resource) => !['33159', '32466', '37816'].includes(resource.id.toString()));
      setAllResources((prev) => [...prev, ...processedResources]);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      });
    } catch (err) {
      console.error('Error fetching more resources:', err);
      setError('Failed to load more resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, pagination.currentPage, subjectName, sortBy]);

  // Create and set up the intersection observer
  const setupObserver = useCallback(() => {
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          fetchMoreResources();
        }
      },
      {
        root: null, // Use the viewport
        rootMargin: '0px 0px 200px 0px', // Start loading 200px before the element is visible
        threshold: 0.1,
      }
    );

    // Observe the loadMoreRef element if it exists
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [fetchMoreResources, hasMore, loading]);

  // Set up the observer when component mounts and whenever dependencies change
  useEffect(() => {
    setupObserver();

    // Clean up observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  // After DOM is rendered, ensure observer is attached to the loadMoreRef element
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadMoreRef.current && observerRef.current) {
        observerRef.current.observe(loadMoreRef.current);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [allResources]);

  // Reset resources when subject or sort changes
  useEffect(() => {
    setAllResources(resources);
    setPagination(initialPagination);
    setInitialLoad(false);
  }, [resources, initialPagination, subjectName, sortBy]);

  // During initial load
  if (initialLoad) {
    return <SubjectSkeletonGrid />;
  }

  // No resources available
  if (!allResources || allResources.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-gray-500">No resources available for this subject.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[16px] md:gap-x-[32px] gap-y-[24px] md:gap-y-[24px]">
        {allResources.map((resource) => (
          <SubjectItem
            key={resource.id}
            parentSubject={{
              id: subjectId,
              name: subjectName,
            }}
            item={{
              id: parseInt(resource.id) || 0,
              imageUrl: resource.thumbnail || '/assets/subject-category.webp',
              label: resource.title,
              moduleCounts: resource.subjects.length || 0,
              videoCounts: resource.assets.length || 0,
            }}
          />
        ))}
      </div>

      {/* Additional row for loading more */}
      {hasMore && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 md:gap-x-[32px] gap-y-[24px] md:gap-y-[24px] opacity-0">
          <SubjectItem
            parentSubject={{
              id: subjectId,
              name: subjectName,
            }}
            item={{
              id: 0,
              imageUrl: '/assets/subject-category.webp',
              label: 'Loading...',
              moduleCounts: 0,
              videoCounts: 0,
            }}
          />
        </div>
      )}

      {/* Loading indicator and loader element */}
      <div
        ref={loadMoreRef}
        className="w-full py-6 flex justify-center items-center"
        id="load-more-trigger"
      >
        {loading && <Spin tip="Loading more resources..." />}
        {!loading && hasMore && <div className="text-gray-400 text-sm">Scroll to load more</div>}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default SubjectModuleContent;

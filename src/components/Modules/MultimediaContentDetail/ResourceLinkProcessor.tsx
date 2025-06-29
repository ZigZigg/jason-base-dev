'use client';

import { ResourceCollection } from '@/lib/modules/subjects/data';
import { getVideoAssetFromAssets } from '@/selectors/video_asset_selector';
import React, { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
};

export const ResourceLinkProcessor: React.FC<Props> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processResourcePlaceholders = async () => {
      if (!containerRef.current) return;

      // Find all placeholder divs (both links and images)
      const linkPlaceholders = containerRef.current.querySelectorAll('.resource-link-placeholder[data-resource-id]');
      const imagePlaceholders = containerRef.current.querySelectorAll('.resource-embed-image-placeholder[data-resource-id]');
      const embedVideoPlaceholders = containerRef.current.querySelectorAll('.resource-embed-video-placeholder[data-resource-id]');

      const allPlaceholders = [
        ...Array.from(linkPlaceholders),
        ...Array.from(imagePlaceholders),
        ...Array.from(embedVideoPlaceholders),
      ];

      if (allPlaceholders.length === 0) return;

      // Extract all unique resource IDs
      const resourceIds = [...new Set(allPlaceholders.map(
        (placeholder) => (placeholder as HTMLElement).dataset.resourceId!
      ))];

      // Fetch all resources in parallel using client-side API
      const resourcePromises = resourceIds.map(async (resourceId) => {
        try {
          const response = await fetch(`/api/resources/${resourceId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const resourceData: ResourceCollection = await response.json();
          return { resourceId, resourceData };
        } catch (error) {
          console.error(`Error fetching resource ${resourceId}:`, error);
          return { resourceId, resourceData: null };
        }
      });

      const results = await Promise.all(resourcePromises);

      // Process link placeholders
      results.forEach(({ resourceId, resourceData }) => {
        const linkPlaceholder = containerRef.current?.querySelector(
          `.resource-link-placeholder[data-resource-id="${resourceId}"]`
        );
        if (linkPlaceholder) {
          processLinkPlaceholder(linkPlaceholder, resourceId, resourceData);
        }

        // Process image placeholders
        const imagePlaceholder = containerRef.current?.querySelector(
          `.resource-embed-image-placeholder[data-resource-id="${resourceId}"]`
        );
        if (imagePlaceholder) {
          processImagePlaceholder(imagePlaceholder, resourceId, resourceData);
        }

        // Process image placeholders
        const embedVideoPlaceholder = containerRef.current?.querySelector(
          `.resource-embed-video-placeholder[data-resource-id="${resourceId}"]`
        );
        if (embedVideoPlaceholder) {
          processEmbedVideoPlaceholder(embedVideoPlaceholder, resourceId, resourceData);
        }
      });
    };

    const processLinkPlaceholder = (placeholder: Element, resourceId: string, resourceData: any) => {
      if (resourceData && !resourceData.error) {
        let href = '';

        // Check if ResourceType.name === 'WebLink'
        if (resourceData.type.name === 'WebLink') {
          // Find asset with type.name === 'WebsiteURL'
          const websiteAsset = resourceData.assets.find(
            (asset: any) => asset.type.name === 'WebsiteURL'
          );
          if (websiteAsset) {
            href = websiteAsset.path;
          }
        } else {
          // Use baseUrl/resource/<resourceId>
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
          href = `${baseUrl}/resource/${resourceId}`;
        }

        const resourceTitle = resourceData.type.name === 'Curriculum'
          ? `Curriculum - ${resourceData.title}`
          : resourceData.title;

        // Create and replace with anchor element
        const anchorElement = document.createElement('a');
        anchorElement.href = href;
        anchorElement.target = '_blank';
        anchorElement.rel = 'noopener noreferrer';
        anchorElement.textContent = resourceTitle || `Resource ${resourceId}`;
        anchorElement.className = 'text-blue-600 hover:text-blue-800 underline';

        placeholder.replaceWith(anchorElement);
      } else {
        // Replace with error message
        const errorElement = document.createElement('span');
        errorElement.textContent = `Resource ${resourceId} (not found)`;
        errorElement.className = 'text-red-500';

        placeholder.replaceWith(errorElement);
      }
    };

    const processImagePlaceholder = (placeholder: Element, resourceId: string, resourceData: any) => {
      if (resourceData && !resourceData.error) {
        // Find image from resource.assets array where item.type.name === 'DefaultImage'
        const defaultImage = resourceData.assets.find(
          (asset: any) => asset.type.name === 'DefaultImage'
        );

        if (defaultImage && defaultImage.file_uri) {
          // Create and replace with image element
          const imageElement = document.createElement('img');
          imageElement.src = defaultImage.file_uri;
          imageElement.alt = resourceData.title || `Resource ${resourceId}`;
          imageElement.className = 'h-auto rounded';
          imageElement.style.maxWidth = '100%';

          placeholder.replaceWith(imageElement);
        } else {
          // Replace with error message for missing image
          const errorElement = document.createElement('div');
          errorElement.textContent = `Image not found for resource ${resourceId}`;
          errorElement.className = 'flex items-center justify-center w-full h-32 bg-gray-100 text-gray-500 rounded';

          placeholder.replaceWith(errorElement);
        }
      } else {
        // Replace with error message
        const errorElement = document.createElement('div');
        errorElement.textContent = `Resource ${resourceId} (not found)`;
        errorElement.className = 'flex items-center justify-center w-full h-32 bg-gray-100 text-red-500 rounded';

        placeholder.replaceWith(errorElement);
      }
    };

    const processEmbedVideoPlaceholder = (placeholder: Element, resourceId: string, resourceData: ResourceCollection | null) => {
      const videoAsset = getVideoAssetFromAssets(resourceData?.assets || []);

      if (videoAsset) {
        const embedVideoContainer = document.createElement('div');
        embedVideoContainer.className = 'w-full lg:w-1/2';

        const nameElement = document.createElement('div');
        nameElement.textContent = videoAsset.video_display_name;
        nameElement.className = 'text-center font-bold border-1 border-gray-300 bg-gray-100 p-2';
        embedVideoContainer.appendChild(nameElement)

        // Create a native video element
        const videoElement = document.createElement('video');
        videoElement.src = videoAsset.video_file_uri;
        videoElement.controls = true;
        videoElement.className = 'w-full max-w-full';
        // Add poster/thumbnail if available
        if (videoAsset.video_thumbnail_file_uri) {
          videoElement.poster = videoAsset.video_thumbnail_file_uri;
        }
        embedVideoContainer.appendChild(videoElement);

        placeholder.replaceWith(embedVideoContainer);
      } else {
        // Replace with error message
        const errorElement = document.createElement('div');
        errorElement.textContent = `Resource ${resourceId} (not found)`;
        errorElement.className = 'flex items-center justify-center w-full h-32 bg-gray-100 text-red-500 rounded';

        placeholder.replaceWith(errorElement);
      }
    };

    processResourcePlaceholders();
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
};
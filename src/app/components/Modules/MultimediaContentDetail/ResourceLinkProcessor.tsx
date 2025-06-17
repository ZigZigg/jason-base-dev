'use client';

import React, { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
};

export const ResourceLinkProcessor: React.FC<Props> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processResourceLinks = async () => {
      if (!containerRef.current) return;

      // Find all placeholder divs
      const placeholders = containerRef.current.querySelectorAll('.resource-link-placeholder[data-resource-id]');
      
      if (placeholders.length === 0) return;

      // Extract all resource IDs
      const resourceIds = Array.from(placeholders).map(
        (placeholder) => (placeholder as HTMLElement).dataset.resourceId!
      );

      // Fetch all resources in parallel using client-side API
      const resourcePromises = resourceIds.map(async (resourceId) => {
        try {
          const response = await fetch(`/api/resources/${resourceId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const resourceData = await response.json();
          return { resourceId, resourceData };
        } catch (error) {
          console.error(`Error fetching resource ${resourceId}:`, error);
          return { resourceId, resourceData: null };
        }
      });

      const results = await Promise.all(resourcePromises);

      // Replace placeholders with actual links
      results.forEach(({ resourceId, resourceData }) => {
        const placeholder = containerRef.current?.querySelector(
          `.resource-link-placeholder[data-resource-id="${resourceId}"]`
        );
        
        if (!placeholder) return;

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
      });
    };

    processResourceLinks();
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
}; 
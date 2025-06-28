'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ResourceCollection } from '@/lib/modules/subjects/data';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';
import './jason-resources.scss';
import ContentClientHTMLItem from './ContentClientHTMLItem';
import ContentClientVideoItem from './ContentClientVideoItem';
import ContentClientPDFItem from './ContentClientPDFItem';
type Props = {
  convertedHtmlFragments: any[];
  resource: ResourceCollection;
  parentResource?: ResourceCollection;
  resourceId?: string;
};

const ContentClient = (props: Props) => {
  const { convertedHtmlFragments, resource, resourceId } = props;

  const resourceCollection = useMemo(() => {
    const firstLayer = resource.resource_collections?.length ? resource.resource_collections[0] : null;
    
    return firstLayer ? firstLayer.resource_collection : null;
  }, [resource]);
  const { setItems } = useBreadcrumb();

  const handleUpdateBreadcrumb = async () => {
    const itemsBreadcrumb = [];
    const searchPath = window.location.search;
    if(searchPath){
      const urlParams = new URLSearchParams(searchPath);
      const parentSubjectId = urlParams.get('parentSubjectId');
      const parentSubjectName = urlParams.get('parentSubjectName');
      
      if (parentSubjectId && parentSubjectName) {
        itemsBreadcrumb.push({
          title: parentSubjectName,
          path: `/subjects/${parentSubjectId}`,
        });
      }
    }

    // Traverse nested parent collections (max 2 levels)
    const parentCollections = [];
    let currentCollection = resourceCollection;
    
    // Collect up to 2 parent collections
    while (currentCollection?.parent_collection?.resource_collection && parentCollections.length < 2) {
      const parentCollection = currentCollection.parent_collection.resource_collection;
      parentCollections.unshift(parentCollection); // Add to beginning to maintain order
      currentCollection = parentCollection;
    }

    // Build breadcrumb based on number of parents found
    if (parentCollections.length === 2) {
      // 2 parents: parent2 > parent1 > current
      itemsBreadcrumb.push({
        title: parentCollections[0].title,
        path: `/resource/${parentCollections[0].collection_resource_id}`,
      });
      itemsBreadcrumb.push({
        title: parentCollections[1].title,
        path: `/mission-details/${parentCollections[1].collection_resource_id}`,
      });
    } else if (parentCollections.length === 1) {
      // 1 parent: parent1 > current
      itemsBreadcrumb.push({
        title: parentCollections[0].title,
        path: `/resource/${parentCollections[0].collection_resource_id}`,
      });
    }
    // If no parents found, we just show current resource

    // Add current resource
    itemsBreadcrumb.push({
      title: resource.title,
      path: `/resource-detail/${resource.id}`,
    });

    setItems(itemsBreadcrumb);
  };
  useEffect(() => {
    handleUpdateBreadcrumb();
  }, [resource, resourceId]);

  const renderContents = useCallback(() => {
    // Check for actual assets rather than just resource type
    const hasVideo = resource?.assets?.some(
      asset => asset.type?.name === 'iOSfriendlymp4' && asset.type?.mime_type === 'video/mp4'
    );
    const hasPDF = resource?.assets?.some(
      asset => asset.type?.name === 'PDFVersion' && asset.type?.mime_type === 'application/pdf'
    );

    if (convertedHtmlFragments.length) {
      return (
        <ContentClientHTMLItem
          resource={resource}
          convertedHtmlFragments={convertedHtmlFragments}
        />
      );
    } else if (hasVideo && resource.type.name === 'Video') {
      return <ContentClientVideoItem resource={resource} />;
    } else if (hasPDF) {
      return <ContentClientPDFItem resource={resource} />;
    }
    return <div>No content</div>;
  }, [resource, convertedHtmlFragments]);

  return (
    <div id="multimedia-content" className="w-full resource-container mb-[32px]">
      <div className="flex flex-col gap-[8px] px-[16px] xl:px-[0px]">
        <h1 className=" xl:text-[40px] text-[30px] font-bold !mb-0 xl:leading-[48px] leading-[32px]">
          {resource?.title}{' '}
        </h1>
        <span className="xl:text-[16px] text-[14px] font-[400] text-[#667085]">
          {resource?.description}
        </span>
      </div>
      <div className="h-[1px] w-full bg-[#F2F4F7] my-[24px]"></div>
      {renderContents()}

    </div>
  );
};

export default ContentClient;

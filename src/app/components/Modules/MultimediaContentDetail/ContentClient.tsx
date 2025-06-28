'use client';
import React, { useCallback, useEffect } from 'react';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
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
  const { convertedHtmlFragments, resource, resourceId, parentResource } = props;

  const { setItems } = useBreadcrumb();

  const handleUpdateBreadcrumb = async () => {
    const itemsBreadcrumb = [];
    if (parentResource?.id) {
      itemsBreadcrumb.push({
        title: parentResource.title,
        path: `/resource/${parentResource.id}`,
      });
    }
    const breadcrumbPath = resourceId
      ? `/resource/${resourceId}/content/${resource.id}`
      : `/content/${resource.id}`;

    itemsBreadcrumb.push({
      title: resource.title,
      path: breadcrumbPath,
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

'use client'
import React, { useEffect } from 'react';
import { ResourceLinkProcessor } from './ResourceLinkProcessor';
import { RawHtml } from '../../RawHtml';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';

type Props = {
  convertedHtmlContent: string;
  resource: ResourceCollection;
  parentResource: ResourceCollection;
  resourceId: string;
};

const ContentClient = (props: Props) => {
  const { convertedHtmlContent, resource, resourceId, parentResource } = props;
  const { setItems } = useBreadcrumb();
  const handleUpdateBreadcrumb = async () => {

    const itemsBreadcrumb = []
    if(parentResource?.id){
      itemsBreadcrumb.push({
        title: parentResource.title,
        path: `/resource/${parentResource.id}`,
      })
    }
    itemsBreadcrumb.push({
      title: resource.title,
      path: `/resource/${resourceId}/content/${resource.id}`,
    })
    setItems(itemsBreadcrumb);
  }
  useEffect(() => {
    handleUpdateBreadcrumb();
  }, [resource, resourceId]);
  return (
    <div id="multimedia-content" className="w-full resource-container">
      <div className="flex flex-col gap-[8px] px-[16px] xl:px-[0px]">
        <h1 className=" xl:text-[40px] text-[30px] font-bold !mb-0 xl:leading-[48px] leading-[32px]">
          {resource?.title}{' '}
        </h1>
        <span className="xl:text-[16px] text-[14px] font-[400] text-[#667085]">
          {resource?.description}
        </span>
      </div>
      <div className="h-[1px] w-full bg-[#F2F4F7] my-[24px]"></div>
      <div
        id="html-content"
        className="w-full px-[16px] xl:px-[0px] html-fragment fragment-type-resourcecontent"
      >
        {convertedHtmlContent && (
          <ResourceLinkProcessor>
            <RawHtml>{convertedHtmlContent}</RawHtml>
          </ResourceLinkProcessor>
        )}
      </div>
    </div>
  );
};

export default ContentClient;

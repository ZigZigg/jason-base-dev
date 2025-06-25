'use client'
import React, { useEffect } from 'react';
import { ResourceLinkProcessor } from './ResourceLinkProcessor';
import { RawHtml } from '../../RawHtml';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';
import { useBreadcrumb } from '@/app/providers/BreadcrumbProvider';
import './jason-resources.scss'
type Props = {
  convertedHtmlContent: string;
  resource: ResourceCollection;
  parentResource?: ResourceCollection;
  resourceId?: string;
};

const ContentClient = (props: Props) => {
  const { convertedHtmlContent, resource, resourceId, parentResource } = props;

  const { setItems } = useBreadcrumb();
  
  // Find audio asset from resource assets
  const audioAsset = resource?.assets?.find(asset => asset.type?.name === 'AudioVersion');
  const audioUrl = audioAsset?.file_uri;
  const handleUpdateBreadcrumb = async () => {

    const itemsBreadcrumb = []
    if(parentResource?.id){
      itemsBreadcrumb.push({
        title: parentResource.title,
        path: `/resource/${parentResource.id}`,
      })
    }
    const breadcrumbPath = resourceId 
      ? `/resource/${resourceId}/content/${resource.id}`
      : `/content/${resource.id}`;
      
    itemsBreadcrumb.push({
      title: resource.title,
      path: breadcrumbPath,
    });
    setItems(itemsBreadcrumb);
  }
  useEffect(() => {
    handleUpdateBreadcrumb();
  }, [resource, resourceId]);
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
      <div
        id="html-content"
        className="w-full px-[16px] xl:px-[0px] html-fragment fragment-type-resourcecontent"
      >
        <div id="audio-container">
          {audioUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">Audio Version</span>
              </div>
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
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

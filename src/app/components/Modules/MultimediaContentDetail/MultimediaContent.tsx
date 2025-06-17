import { getConvertedHtmlContent, getResourceById } from '@/app/lib/modules/resource/data';
import React from 'react';
import ContentClient from './ContentClient';

type Props = {
  contentId: string;
  resourceId: string;
};

const MultimediaContent = async (props: Props) => {
  const { contentId, resourceId } = props;
  const resource = await getResourceById(contentId);
  const parentResource = await getResourceById(resourceId);
  // Get first html_fragments content if available
  const firstHtmlFragment = resource?.html_fragments?.[0];
  const htmlContent = firstHtmlFragment?.content || '';
  const convertedHtmlContent = await getConvertedHtmlContent(htmlContent);
  
  return (
    <ContentClient convertedHtmlContent={convertedHtmlContent} resource={resource} resourceId={resourceId} parentResource={parentResource} />
  );
};

export default MultimediaContent;

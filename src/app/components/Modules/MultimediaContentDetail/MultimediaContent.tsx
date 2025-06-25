import { getConvertedHtmlContent, getResourceById } from '@/app/lib/modules/resource/data';
import React from 'react';
import ContentClient from './ContentClient';

type Props = {
  contentId: string;
  resourceId?: string;
};

const MultimediaContent = async (props: Props) => {
  const { contentId, resourceId } = props;
  const resource = await getResourceById(contentId);
  const parentResource = resourceId ? await getResourceById(resourceId) : undefined;
  // Combine all html_fragments content into one string
  const htmlContent = resource?.html_fragments?.map(fragment => fragment.content).join('') || '';
  const convertedHtmlContent = await getConvertedHtmlContent(htmlContent);
  
  return (
    <ContentClient convertedHtmlContent={convertedHtmlContent} resource={resource} resourceId={resourceId} parentResource={parentResource} />
  );
};

export default MultimediaContent;

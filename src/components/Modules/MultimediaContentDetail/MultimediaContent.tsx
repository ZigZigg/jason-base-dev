import { getConvertedHtmlContent, getResourceById } from '@/lib/modules/resource/data';
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
  // Convert all html_fragments with their content processed
  const convertedHtmlFragments = getConvertedHtmlContent(resource?.html_fragments || []);
  
  return (
    <ContentClient convertedHtmlFragments={convertedHtmlFragments} resource={resource} resourceId={resourceId} parentResource={parentResource} />
  );
};

export default MultimediaContent;

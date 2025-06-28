import React from 'react';
import { ResourceLinkProcessor } from './ResourceLinkProcessor';
import { RawHtml } from '../../RawHtml';
import { ResourceCollection } from '@/app/lib/modules/subjects/data';

type Props = {
  resource: ResourceCollection;
  convertedHtmlFragments: any[];
};

const ContentClientHTMLItem = (props: Props) => {
  const { resource, convertedHtmlFragments } = props;
  // Find audio asset from resource assets
  const audioAsset = resource?.assets?.find((asset) => asset.type?.name === 'AudioVersion');
  const audioUrl = audioAsset?.file_uri;
  return (
    <div id="html-content" className="w-full px-[16px] xl:px-[0px]">
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
      {convertedHtmlFragments.map((fragment, index) => (
        <div key={index}>
          {fragment.title && <h1 className="html-fragment-title">{fragment.title}</h1>}
          <div className="html-fragment fragment-type-resourcecontent">
            {fragment.content && (
              <ResourceLinkProcessor>
                <RawHtml>{fragment.content}</RawHtml>
              </ResourceLinkProcessor>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentClientHTMLItem;

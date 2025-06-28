import { ResourceCollection } from '@/app/lib/modules/subjects/data'
import React from 'react'

type Props = {
    resource: ResourceCollection
}

const ContentClientPDFItem = (props: Props) => {
    const { resource } = props

    // Find PDF asset
    const pdfAsset = resource?.assets?.find(
        asset => asset.type?.name === 'PDFVersion' && asset.type?.mime_type === 'application/pdf'
    );
    const pdfUrl = pdfAsset?.file_uri;

    // Extract data for information panels
    const resourceCollection = resource?.resource_collections?.[0]?.resource_collection;
    const parentCollection = resourceCollection?.parent_collection?.resource_collection;

    const operationData = {
        title: parentCollection?.title_prefix || '',
        subtitle: parentCollection?.title || ''
    };

    const missionData = {
        title: resourceCollection?.title_prefix || '',
        subtitle: resourceCollection?.title || ''
    };

    const InfoPanel = ({ title, subtitle, isLast = false }: { title: string; subtitle: string; isLast?: boolean }) => (
        <div className={`mb-[18px] ${!isLast ? 'border-b border-[#F2F4F7]' : ''} pb-[6px]`}>
            <h2 className="text-[16px] text-[#333333] mb-1">
                {title}
            </h2>
            <p className="text-[14px] text-[#b3bbbe] leading-relaxed">
                {subtitle}
            </p>
        </div>
    );

    if (!pdfUrl) {
        return (
            <div className="w-full p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">PDF not available</p>
            </div>
        );
    }

    return (
        <div className="w-full px-[16px] xl:px-[0px]">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Left side - PDF Viewer */}
                <div className="w-full lg:w-2/3">
                    <div className="relative w-full h-[600px] lg:h-[700px] bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0"
                            title="PDF Viewer"
                        >
                            <p>Your browser does not support iframes. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Click here to view the PDF</a></p>
                        </iframe>
                    </div>
                </div>

                {/* Right side - Information Panels */}
                <div className="w-full lg:w-1/3">
                    <div className="space-y-6">
                        {/* Operation Section */}
                        {(operationData.title || operationData.subtitle) && (
                            <InfoPanel 
                                title="Operation"
                                subtitle={`${operationData.title}${operationData.subtitle ? ` | ${operationData.subtitle}` : ''}`}
                            />
                        )}

                        {/* Mission Section */}
                        {(missionData.title || missionData.subtitle) && (
                            <InfoPanel 
                                title={missionData.title || 'Mission'}
                                subtitle={missionData.subtitle}
                            />
                        )}

                        {/* Description Section */}
                        {resource?.description && (
                            <InfoPanel 
                                title="Description"
                                subtitle={resource.description}
                                isLast={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentClientPDFItem

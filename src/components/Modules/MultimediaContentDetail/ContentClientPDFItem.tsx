import { ResourceCollection } from '@/lib/modules/subjects/data'
import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

type Props = {
    resource: ResourceCollection
}

const ContentClientPDFItem = (props: Props) => {
    const { resource } = props
    const [isIOS, setIsIOS] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false); // Will be set to true only for iOS
    const [error, setError] = useState<string | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(800);

    // Detect iOS devices
    useEffect(() => {
        const detectIOS = () => {
            // Modern iPads (2019+) show as Mac in user agent but have touch support
            const isIPadPro = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
            const isOlderiPad = /iPad/.test(navigator.userAgent);
            const isiPhone = /iPhone/.test(navigator.userAgent);
            
            
            return isiPhone || isOlderiPad || isIPadPro;
        };
        const isIOSDevice = detectIOS();
        setIsIOS(isIOSDevice);
        
        // Set loading to true only for iOS (react-pdf needs loading state)
        if (isIOSDevice) {
            setLoading(true);
        }
    }, []);

    // Handle window resize for responsive PDF (only for iOS)
    useEffect(() => {
        if (!isIOS) return;
        
        const handleResize = () => {
            const container = document.getElementById('pdf-container');
            if (container) {
                setContainerWidth(container.offsetWidth - 32); // Subtract padding
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isIOS]);

    // Find PDF asset
    const pdfAsset = resource?.assets?.find(
        asset => asset.type?.name === 'PDFVersion' && asset.type?.mime_type === 'application/pdf'
    );
    const originalPdfUrl = pdfAsset?.file_uri;
    
    // Use proxy for iOS (react-pdf), direct URL for others (iframe)
    const pdfUrl = originalPdfUrl 
        ? (isIOS ? `/api/pdf-proxy?url=${encodeURIComponent(originalPdfUrl)}` : originalPdfUrl)
        : null;

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
                    {isIOS ? (
                        /* iOS - Use react-pdf for better compatibility */
                        <div id="pdf-container" className="relative w-full bg-white rounded-lg shadow-sm border">
                            {error ? (
                                <div className="flex flex-col items-center justify-center h-[400px] p-6 text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading PDF</h3>
                                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                                    <a 
                                        href={originalPdfUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Open in New Tab
                                    </a>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {/* PDF Controls */}
                                    {numPages && (
                                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage <= 1}
                                                    className="px-3 py-1 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-sm text-gray-600">
                                                    Page {currentPage} of {numPages}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                                                    disabled={currentPage >= numPages}
                                                    className="px-3 py-1 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                            <a 
                                                href={originalPdfUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[16px] text-blue-600 hover:text-blue-800"
                                            >
                                                Open Full PDF
                                            </a>
                                        </div>
                                    )}

                                    {/* PDF Document */}
                                    <div className="flex justify-center p-4 min-h-[500px]">
                                        {loading && (
                                            <div className="flex items-center justify-center h-[400px]">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span className="ml-2 text-gray-600">Loading PDF...</span>
                                            </div>
                                        )}
                                        <Document
                                            file={pdfUrl}
                                            onLoadSuccess={({ numPages }) => {
                                                setNumPages(numPages);
                                                setLoading(false);
                                                setError(null);
                                            }}
                                            onLoadError={(error) => {
                                                setError('Failed to load PDF. Please try again.');
                                                setLoading(false);
                                                console.error('PDF load error:', error);
                                            }}
                                            loading=""
                                        >
                                            {!loading && (
                                                <Page
                                                    pageNumber={currentPage}
                                                    width={Math.min(containerWidth, 800)}
                                                    renderAnnotationLayer={true}
                                                    renderTextLayer={true}
                                                    className="shadow-lg"
                                                />
                                            )}
                                        </Document>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Desktop/Android - Use simple iframe */
                        <div className="relative w-full h-[600px] lg:h-[700px] bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full border-0"
                                title="PDF Viewer"
                            >
                                <p>Your browser does not support iframes. <a href={originalPdfUrl} target="_blank" rel="noopener noreferrer">Click here to view the PDF</a></p>
                            </iframe>
                        </div>
                    )}
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

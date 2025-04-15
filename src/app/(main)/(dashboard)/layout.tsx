'use client';

import { Layout } from 'antd';
import Sidebar from '@/app/components/ui/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSubjectDetailPage = pathname?.match(/\/subjects\/[^/]+$/);
  
  return (
    <Layout
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <div className="w-full xl:w-[1416px] h-auto flex flex-col md:flex-row gap-6 md:gap-8 py-4 px-4 xl:px-0">
        {/* Sidebar - hidden on mobile for subject detail pages */}
        <div className={`flex-shrink-0`}>
          <Sidebar />
        </div>
        <div className="flex flex-col w-full flex-1 min-w-0">
          {/* Back link - shown only on mobile for subject detail pages */}
          {/* {isSubjectDetailPage && (
            <div id="back-to-main" className="flex items-center gap-1.5 mb-[14px] md:hidden">
              <Image 
                className="rotate-270" 
                src="/assets/icon/up-icon.svg" 
                alt="Back Icon" 
                width={14} 
                height={6} 
              />
              <Link 
                className="text-[#667085]! font-[400] text-sm" 
                href="/subjects/0"
              >
                Back to Subjects
              </Link>
            </div>
          )} */}
          
          {children}
        </div>
      </div>
    </Layout>
  );
}

'use client';

import { Layout } from 'antd';
import Sidebar from '@/app/components/ui/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
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
          {children}
        </div>
      </div>
    </Layout>
  );
}

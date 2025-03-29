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
      <div className="w-[100%] md:w-[1416px] h-auto flex flex-col md:flex-row gap-[24px] md:gap-[32px] py-[16px] px-[16px] md:px-[0px]">
        <Sidebar />
        {children}
      </div>
    </Layout>
  );
}

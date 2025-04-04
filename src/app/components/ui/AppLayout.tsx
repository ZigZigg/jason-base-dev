"use client";

import { Layout } from "antd";
import AppHeader from "./Header/Header";
import OrientationLock from "./OrientationLock";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor:'transparent' }}>
      <OrientationLock />
      <AppHeader />
      <div>
        {children}
      </div>
    </Layout>
  );
}
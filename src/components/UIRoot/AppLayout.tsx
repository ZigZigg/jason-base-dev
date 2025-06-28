"use client";

import { Layout } from "antd";
import AppHeader from "./Header/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor:'transparent' }}>
      <AppHeader />
      <div>
        {children}
      </div>
    </Layout>
  );
}
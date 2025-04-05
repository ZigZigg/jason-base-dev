import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AppLayout from "./components/ui/AppLayout";
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}

"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/app/lib/store";
import { NoticeProvider } from "./providers/NoticeProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { SessionProvider } from "next-auth/react";
import { OrientationProvider } from "./providers/OrientationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={makeStore()}>
      <SessionProvider>
        <OrientationProvider>
          <NotificationProvider>
            <NoticeProvider>
              {children}
            </NoticeProvider>
          </NotificationProvider>
        </OrientationProvider>
      </SessionProvider>
    </Provider>
  );
}
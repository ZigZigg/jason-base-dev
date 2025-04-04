"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/app/lib/store";
import { NoticeProvider } from "./providers/NoticeProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={makeStore()}>
      <SessionProvider>
          <NotificationProvider>
            <NoticeProvider>
              {children}
            </NoticeProvider>
          </NotificationProvider>
      </SessionProvider>
    </Provider>
  );
}
"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/app/lib/store";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { NoticeProvider } from "./providers/NoticeProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={makeStore()}>
      <SessionProvider>
        <NotificationProvider>
          <NoticeProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </NoticeProvider>
        </NotificationProvider>
      </SessionProvider>
    </Provider>
  );
}
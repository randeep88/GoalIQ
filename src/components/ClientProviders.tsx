"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "./theme-provider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <Toaster richColors />
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

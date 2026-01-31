import { cn } from "@/lib/utils";
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div
      className={cn("relative w-full min-h-screen pt-20 lg:pt-24", className)}
    >
      {children}
    </div>
  );
};

export default PageContainer;

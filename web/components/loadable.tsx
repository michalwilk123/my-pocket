"use client";

import type { ReactNode } from "react";

type LoadableProps = {
  isLoading: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export function Loadable({ isLoading, fallback, children }: LoadableProps) {
  if (isLoading) {
    return (
      <>{fallback ?? <span className="loading loading-spinner loading-sm" />}</>
    );
  }
  return <>{children}</>;
}

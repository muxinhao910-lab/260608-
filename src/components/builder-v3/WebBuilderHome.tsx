"use client";

import { WebBuilderProvider } from "./WebBuilderProvider";
import { WebBuilderShell } from "./WebBuilderShell";

export function WebBuilderHome({ initialOpen }: { initialOpen: boolean }) {
  return (
    <WebBuilderProvider initialOpen={initialOpen}>
      <WebBuilderShell />
    </WebBuilderProvider>
  );
}

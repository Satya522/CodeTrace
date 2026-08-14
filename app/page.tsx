"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CodeTraceApp } from "@/frontend/views/HomeView/CodeTraceApp";

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-bg text-accentBlue"><Loader2 className="animate-spin" /></div>}>
      <CodeTraceApp />
    </Suspense>
  );
}

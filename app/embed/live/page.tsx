import { Suspense } from "react";
import { LiveEmbedClient } from "./LiveEmbedClient";
import { Loader2 } from "lucide-react";

export default function LiveEmbedPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0f1a]">
      <Suspense fallback={<div className="flex h-full items-center justify-center text-accentBlue"><Loader2 className="animate-spin" /></div>}>
        <LiveEmbedClient />
      </Suspense>
    </div>
  );
}

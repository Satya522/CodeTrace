import { notFound } from "next/navigation";
import { EXAMPLES } from "@/frontend/lib";
import { EmbedVisualizer } from "./EmbedVisualizer";

export default function EmbedPage({ params }: { params: { id: string } }) {
  const example = EXAMPLES.find((ex) => ex.id === params.id);

  if (!example) {
    return notFound();
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <EmbedVisualizer example={example} />
    </div>
  );
}

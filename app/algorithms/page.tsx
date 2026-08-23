import { AlgorithmsView } from "../../src/frontend/views/AlgorithmsView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Algorithm Library - CodeTrace",
  description: "A curated library of visualizable computer science algorithms, from Backtracking to Dynamic Programming.",
};

export default function AlgorithmsPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'algorithms.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <AlgorithmsView markdownContent={markdownContent} />;
}

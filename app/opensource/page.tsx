import { OpenSourceView } from "../../src/frontend/views/OpenSourceView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Open Source - CodeTrace",
  description: "Join the CodeTrace community and contribute to the ultimate visual code execution engine.",
};

export default function OpenSourcePage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'open_source.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <OpenSourceView markdownContent={markdownContent} />;
}

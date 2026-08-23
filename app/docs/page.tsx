import { DocsView } from "../../src/frontend/views/DocsView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Documentation - CodeTrace",
  description: "Official documentation for the CodeTrace platform.",
};

export default function DocsPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'docs.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <DocsView markdownContent={markdownContent} />;
}

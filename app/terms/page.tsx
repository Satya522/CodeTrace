import { TermsView } from "../../src/frontend/views/TermsView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Terms of Service - CodeTrace",
  description: "Rules and guidelines for using the CodeTrace platform.",
};

export default function TermsPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'terms_of_service.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <TermsView markdownContent={markdownContent} />;
}

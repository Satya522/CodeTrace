import { PrivacyView } from "../../src/frontend/views/PrivacyView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Privacy Policy - CodeTrace",
  description: "Learn how we protect your data and code at CodeTrace.",
};

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'privacy_policy.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <PrivacyView markdownContent={markdownContent} />;
}

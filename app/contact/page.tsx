import { ContactView } from "../../src/frontend/views/ContactView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Contact Us - CodeTrace",
  description: "Get in touch with the creator of CodeTrace.",
};

export default function ContactPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'contact_us.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <ContactView markdownContent={markdownContent} />;
}

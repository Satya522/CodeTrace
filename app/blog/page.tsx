import { BlogView } from "../../src/frontend/views/BlogView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Blog & Updates - CodeTrace",
  description: "Read the latest engineering blogs and product updates from the CodeTrace team.",
};

export default function BlogPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'blog.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <BlogView markdownContent={markdownContent} />;
}

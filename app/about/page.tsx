import { AboutView } from "@/frontend/views/AboutView";
import fs from "fs";
import path from "path";

export default function AboutPage() {
  const mdPath = path.join(process.cwd(), "src", "content", "about_us.md");
  const markdownContent = fs.readFileSync(mdPath, "utf-8");

  return <AboutView markdownContent={markdownContent} />;
}

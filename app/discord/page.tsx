import { DiscordView } from "../../src/frontend/views/DiscordView";
import { Metadata } from "next";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "Discord Community - CodeTrace",
  description: "Join the official CodeTrace Discord server. Talk about algorithms, web development, and the CodeTrace engine.",
};

export default function DiscordPage() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'discord.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <DiscordView markdownContent={markdownContent} />;
}

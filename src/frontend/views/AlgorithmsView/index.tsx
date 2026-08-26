"use client";

import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { Navbar } from "../HomeView/HeroLanding/Navbar";
import { Footer } from "../HomeView/HeroLanding/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const inter = Inter({ subsets: ["latin"] });

export const AlgorithmsView = ({ markdownContent }: { markdownContent: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden bg-[#0A0A0A] text-white selection:bg-[#06B6D4]/30 ${inter.className}`}>
      {/* Background glow effects - Styled with Cyan for Algorithms */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-[#06B6D4]/15 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[#00E676]/5 blur-[150px]" />
        <div className="absolute bottom-0 left-[20%] h-[400px] w-[600px] rounded-full bg-[#06B6D4]/10 blur-[150px]" />
      </div>

      <Navbar onStart={() => {}} />

      <main className="relative z-10 flex flex-col items-center pt-24 pb-20">
        <article className="w-full max-w-6xl px-8 md:px-14 lg:px-20">
          
          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight 
            prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:mb-8 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-[#00E676]
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3
            prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-[#00E676]
            prose-p:text-white/70 prose-p:leading-relaxed 
            prose-a:text-[#00E676] prose-a:no-underline hover:prose-a:underline prose-a:transition-all
            prose-strong:text-white prose-strong:font-semibold
            prose-hr:border-white/10 prose-hr:my-12 prose-hr:border-dashed
            prose-table:w-full prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
            prose-th:bg-white/5 prose-th:p-4 prose-th:text-left prose-th:border-b prose-th:border-white/10
            prose-td:p-4 prose-td:border-b prose-td:border-white/10
            prose-blockquote:border-l-4 prose-blockquote:border-[#00E676] prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#00E676]/10 prose-blockquote:to-transparent prose-blockquote:not-italic prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:text-white/90 prose-blockquote:shadow-sm
            prose-img:rounded-xl prose-img:shadow-2xl prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/[0.06] prose-pre:shadow-xl prose-pre:rounded-xl
            prose-code:text-[#e6edf3] prose-ol:text-white/70 prose-ul:text-white/70 prose-li:text-white/70">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const isInline = !className;
                  
                  return (
                    <code {...rest} className={isInline ? 'bg-white/[0.08] text-[#e6edf3] px-1.5 py-0.5 rounded-md text-sm font-mono border border-white/[0.08]' : className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
};

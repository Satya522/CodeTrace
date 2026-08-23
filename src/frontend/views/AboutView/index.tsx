"use client";

import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "../HomeView/HeroLanding/Navbar";
import { Footer } from "../HomeView/HeroLanding/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Dynamic Mermaid component using CDN to prevent heavy webpack bundling
const Mermaid = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let script = document.getElementById('mermaid-script') as HTMLScriptElement;
    
    const renderDiagram = () => {
      // @ts-ignore
      if (window.mermaid) {
        // @ts-ignore
        window.mermaid.initialize({ startOnLoad: true, theme: 'dark', fontFamily: 'Inter, sans-serif' });
        // @ts-ignore
        window.mermaid.render('mermaid-svg-' + Math.random().toString(36).substring(7), text)
          .then((result: any) => {
            if (containerRef.current) containerRef.current.innerHTML = result.svg;
          }).catch(console.error);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = 'mermaid-script';
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.onload = () => {
        script.setAttribute('data-loaded', 'true');
        renderDiagram();
      };
      document.body.appendChild(script);
    } else {
      if (script.getAttribute('data-loaded') === 'true') {
        renderDiagram();
      } else {
        script.addEventListener('load', renderDiagram);
      }
    }
  }, [text]);

  return <div ref={containerRef} className="flex justify-center my-8 min-h-[200px] items-center text-white/50" />;
};

export const AboutView = ({ markdownContent }: { markdownContent: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden bg-[#0A0A0A] text-white selection:bg-cyan-500/30 ${inter.className}`}>
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[#00E676]/5 blur-[150px]" />
        <div className="absolute bottom-0 left-[20%] h-[400px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      <Navbar onStart={() => {}} />

      <main className="relative z-10 flex flex-col items-center pt-24 pb-20">
        <article className="w-full max-w-4xl px-6 md:px-8">
          
          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight 
            prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:mb-8 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-white/60
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3
            prose-p:text-white/70 prose-p:leading-relaxed 
            prose-a:text-[#00E676] prose-a:no-underline hover:prose-a:underline prose-a:transition-all
            prose-strong:text-white prose-strong:font-semibold
            prose-hr:border-white/10 prose-hr:my-10
            prose-table:w-full prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
            prose-th:bg-white/5 prose-th:p-4 prose-th:text-left prose-th:border-b prose-th:border-white/10
            prose-td:p-4 prose-td:border-b prose-td:border-white/10
            prose-blockquote:border-l-4 prose-blockquote:border-[#00E676] prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#00E676]/10 prose-blockquote:to-transparent prose-blockquote:not-italic prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:text-white/90 prose-blockquote:shadow-sm
            prose-img:rounded-xl prose-img:shadow-2xl">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  
                  if (match && match[1] === 'mermaid') {
                    return <Mermaid text={String(children).replace(/\n$/, '')} />;
                  }
                  
                  return (
                    <code {...rest} className={className ? `${className} bg-white/10 text-[#00E676] px-1.5 py-0.5 rounded-md text-sm font-mono` : 'bg-white/10 text-[#00E676] px-1.5 py-0.5 rounded-md text-sm font-mono'}>
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

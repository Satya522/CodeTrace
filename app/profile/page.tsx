"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { Navbar } from "../../src/frontend/views/HomeView/HeroLanding/Navbar";
import { Footer } from "../../src/frontend/views/HomeView/HeroLanding/Footer";
import { Loader2, Code2, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchSnippets();
    }
  }, [status, router]);

  const fetchSnippets = async () => {
    try {
      const res = await fetch("/api/snippets");
      const data = await res.json();
      if (data.snippets) {
        setSnippets(data.snippets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // In a real app, you would add a DELETE method to the API. 
    // For now we'll just optimistically remove it from state.
    setSnippets(snippets.filter((s) => s.id !== id));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden bg-[#0A0A0A] text-white selection:bg-[#22D3EE]/30 ${inter.className}`}>
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      <Navbar onStart={() => router.push("/")} />

      <main className="relative z-10 flex flex-col items-center pt-32 pb-20 px-6">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">My Profile</h1>
              <p className="text-white/50">Welcome back, <span className="text-cyan-400 font-semibold">{session?.user?.name}</span>.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/">
                <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all text-sm flex items-center gap-2">
                  <Code2 size={16} /> Open Editor
                </button>
              </Link>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <DatabaseIcon size={16} />
            </span>
            Saved Snippets
          </h2>

          {snippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-white/20">
                <Code2 size={32} />
              </div>
              <h3 className="text-lg font-semibold text-white/80 mb-2">No snippets yet</h3>
              <p className="text-white/40 text-sm max-w-sm mb-6">You haven't saved any code snippets to the cloud yet. Open the editor and save your first one!</p>
              <Link href="/">
                <button className="px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm font-semibold flex items-center gap-2">
                  Create Snippet <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snippets.map((snippet, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={snippet.id} 
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="font-semibold text-lg text-white/90 group-hover:text-cyan-400 transition-colors line-clamp-1">{snippet.title}</h3>
                    <button onClick={() => handleDelete(snippet.id)} className="text-white/20 hover:text-red-400 transition-colors p-1" title="Delete Snippet">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase tracking-wider">
                      {snippet.language}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex-1 rounded-xl bg-black/50 border border-white/5 p-3 overflow-hidden relative z-10">
                    <pre className="text-xs font-mono text-white/50 line-clamp-4">
                      {snippet.code}
                    </pre>
                  </div>

                  <Link href={`/?code=${btoa(snippet.code)}&lang=${snippet.language}`} className="mt-4 relative z-10">
                    <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-white/70 hover:text-cyan-400 transition-all text-sm font-medium flex items-center justify-center gap-2">
                      Load in Editor
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

const DatabaseIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19C3 20.6569 7.02944 22 12 22C16.9706 22 21 20.6569 21 19V5" />
    <path d="M3 12C3 13.6569 7.02944 15 12 15C16.9706 15 21 13.6569 21 12" />
  </svg>
);

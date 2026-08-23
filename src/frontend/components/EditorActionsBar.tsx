import { Target, Video, Square, Share2, Check, Code, Github, Maximize, Minimize } from "lucide-react";

interface EditorActionsBarProps {
  onOpenDailyChallenge: () => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  copied: boolean;
  handleShare: () => void;
  embedCopied: boolean;
  handleEmbed: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const IconButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive = false, 
  activeColor = "text-cyan-400" 
}: { 
  icon: any; 
  label: string; 
  onClick: () => void; 
  isActive?: boolean; 
  activeColor?: string;
}) => (
  <div className="relative group flex items-center justify-center">
    <button 
      onClick={onClick}
      className={`flex items-center justify-center p-2.5 border-t-2 border-b-0 transition-all duration-200 ${
        isActive 
          ? `${activeColor} bg-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]` 
          : `${activeColor.replace('text-', 'text-').replace('border-', 'border-transparent text-opacity-50 hover:text-opacity-100 hover:bg-white/5')}`
      }`}
    >
      <Icon size={16} className={isActive && label === "Stop Recording" ? "animate-pulse text-red-400" : ""} />
    </button>
    <div className="absolute bottom-full mb-2 px-2 py-1 bg-[#1E293B] border border-white/10 shadow-lg text-white/90 text-[10px] font-medium whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {label}
    </div>
  </div>
);

export function EditorActionsBar({
  onOpenDailyChallenge,
  isRecording,
  onStartRecording,
  onStopRecording,
  copied,
  handleShare,
  embedCopied,
  handleEmbed,
  isFullscreen,
  toggleFullscreen
}: EditorActionsBarProps) {
  return (
    <div className="flex items-center ml-auto gap-0">
      <IconButton 
        icon={Target} 
        label="Daily Challenge" 
        onClick={onOpenDailyChallenge}
        activeColor="text-rose-400"
      />
      
      {isRecording ? (
        <IconButton 
          icon={Square} 
          label="Stop Recording" 
          onClick={onStopRecording} 
          isActive={true}
          activeColor="text-red-400"
        />
      ) : (
        <IconButton 
          icon={Video} 
          label="Record Video" 
          onClick={onStartRecording}
          activeColor="text-purple-400"
        />
      )}

      <IconButton 
        icon={copied ? Check : Share2} 
        label="Share Link" 
        onClick={handleShare} 
        isActive={copied}
        activeColor={copied ? "text-emerald-400" : "text-blue-400"}
      />

      <IconButton 
        icon={embedCopied ? Check : Code} 
        label="Copy Embed" 
        onClick={handleEmbed} 
        isActive={embedCopied}
        activeColor="text-cyan-400"
      />

      <IconButton 
        icon={isFullscreen ? Minimize : Maximize} 
        label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
        onClick={toggleFullscreen}
        activeColor="text-amber-400"
      />

      <div className="relative group flex items-center justify-center">
        <a 
          href="https://github.com/Satya522/CodeTrace" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center p-2.5 border-t-2 border-b-0 border-transparent text-zinc-300 text-opacity-50 hover:text-opacity-100 hover:bg-white/5 transition-all duration-200"
        >
          <Github size={16} />
        </a>
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-[#1E293B] border border-white/10 shadow-lg text-white/90 text-[10px] font-medium whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          GitHub
        </div>
      </div>
    </div>
  );
}

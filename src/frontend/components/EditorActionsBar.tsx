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
  activeColor = "text-[#00E676] border-[#00E676] bg-emerald-500/10" 
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
          ? `${activeColor} shadow-[inset_0_2px_10px_rgba(0,230,118,0.08)]` 
          : `border-transparent text-white/40 hover:text-white hover:bg-white/[0.04]`
      }`}
    >
      <Icon size={16} className={isActive && label === "Stop Recording" ? "animate-pulse text-red-400" : (isActive ? "" : "text-white/40 group-hover:text-white/80 transition-colors")} />
    </button>
    <div className="absolute bottom-full mb-2 px-2.5 py-1 bg-[#010409]/95 border border-white/10 shadow-xl text-white/90 text-[11px] font-sans font-medium whitespace-nowrap rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
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
    <div className="flex items-center ml-auto gap-0.5">
      <IconButton 
        icon={Target} 
        label="Daily Challenge" 
        onClick={onOpenDailyChallenge}
        activeColor="text-[#00E676] border-[#00E676] bg-emerald-500/10"
      />
      
      {isRecording ? (
        <IconButton 
          icon={Square} 
          label="Stop Recording" 
          onClick={onStopRecording} 
          isActive={true}
          activeColor="text-red-400 border-red-400 bg-red-500/10"
        />
      ) : (
        <IconButton 
          icon={Video} 
          label="Record Video" 
          onClick={onStartRecording}
        />
      )}

      <IconButton 
        icon={copied ? Check : Share2} 
        label="Share Link" 
        onClick={handleShare} 
        isActive={copied}
        activeColor="text-[#00E676] border-[#00E676] bg-emerald-500/10"
      />

      <IconButton 
        icon={embedCopied ? Check : Code} 
        label="Copy Embed" 
        onClick={handleEmbed} 
        isActive={embedCopied}
        activeColor="text-[#00E676] border-[#00E676] bg-emerald-500/10"
      />

      <IconButton 
        icon={isFullscreen ? Minimize : Maximize} 
        label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
        onClick={toggleFullscreen}
        isActive={isFullscreen}
        activeColor="text-[#00E676] border-[#00E676] bg-emerald-500/10"
      />

      <div className="relative group flex items-center justify-center">
        <a 
          href="https://github.com/Satya522/CodeTrace" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center p-2.5 border-t-2 border-b-0 border-transparent text-white/40 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
        >
          <Github size={16} />
        </a>
        <div className="absolute bottom-full mb-2 px-2.5 py-1 bg-[#010409]/95 border border-white/10 shadow-xl text-white/90 text-[11px] font-sans font-medium whitespace-nowrap rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          GitHub
        </div>
      </div>
    </div>
  );
}

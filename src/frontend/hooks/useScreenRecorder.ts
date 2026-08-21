import { useState, useRef, useCallback } from "react";

export function useScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      // Prompt user to select screen/tab
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: false,
      });

      const options = { mimeType: "video/webm; codecs=vp9" };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback for browsers that don't support vp9 (e.g. Safari)
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = `codetrace-animation-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setIsRecording(false);
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // If user stops sharing via browser UI, stop recording automatically
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start screen recording", err);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return { isRecording, startRecording, stopRecording };
}

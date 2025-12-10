import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface ClickableVideoProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  muted?: boolean;
  autoPlay?: boolean;
}

export function ClickableVideo({
  src,
  poster,
  alt,
  className = "",
  aspectRatio = "16:9",
  muted = true,
  autoPlay = false,
}: ClickableVideoProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
  };

  const handleClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            console.log("Play prevented");
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      className={`relative cursor-pointer ${aspectRatioClasses[aspectRatio]} flex flex-col rounded-xl overflow-hidden ${className}`}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        autoPlay={autoPlay}
        loop
        playsInline
        className="object-cover w-full h-full"
        aria-label={alt}
      />

      {/* Click to play overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30 ${
          isPlaying ? "opacity-0" : "opacity-100"
        } transition-all duration-300 flex flex-col items-center justify-center pointer-events-none`}
      >
        <div className="bg-orange-500 hover:bg-orange-600 rounded-full p-4 mb-3 shadow-lg transform transition-transform duration-200 hover:scale-110">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          <p className="text-sm font-medium text-gray-800">
            {isPlaying ? "Click to pause" : "Click to play"}
          </p>
        </div>
      </div>
    </div>
  );
}

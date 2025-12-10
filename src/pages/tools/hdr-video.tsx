import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Download,
  Sparkles,
  X,
  Heart,
  MessageCircle,
  Share,
  ChevronRight,
  Play,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { HDRNavbar } from "@/components/HDRNavbar";
import { cn } from "@/lib/utils";

// Facebook Video Post Mockup Component
function FacebookVideoMockup({
  videoSrc,
  hideOverlay = false,
}: {
  videoSrc: string | null;
  hideOverlay?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 w-full">
      {/* Post header */}
      {!hideOverlay && (
        <div className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-sm">Your Name</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>Just now</span>
              <span>·</span>
              <span>🌐</span>
            </div>
          </div>
        </div>
      )}

      {/* Post text */}
      {!hideOverlay && (
        <div className="px-3 pb-2">
          <p className="text-gray-900 text-sm">Check out this HDR video! ✨</p>
        </div>
      )}

      {/* Video area - 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] bg-black">
        {videoSrc ? (
          <video
            src={videoSrc}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <p className="text-white/70 text-sm">Your HDR video here</p>
            </div>
          </div>
        )}
      </div>

      {/* Post actions */}
      {!hideOverlay && (
        <div className="p-3 border-t border-gray-100">
          <div className="flex justify-between text-gray-500 text-sm mb-2">
            <span>❤️ 1.2K</span>
            <span>48 comments · 12 shares</span>
          </div>
          <div className="flex justify-around border-t border-gray-100 pt-2">
            <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
              <Heart className="w-5 h-5" />
              <span>Like</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
              <MessageCircle className="w-5 h-5" />
              <span>Comment</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
              <Share className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HDRVideoGenerator() {
  const [originalVideo, setOriginalVideo] = useState<string | null>(null);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // HDR settings
  const [intensity, setIntensity] = useState(1.5);
  const [saturation, setSaturation] = useState(1.0);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Video must be less than 50MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalVideo(e.target?.result as string);
      setProcessedVideo(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processVideo = async () => {
    if (!originalVideo) return;

    setIsProcessing(true);
    setError(null);
    setProgress("Processing video... This may take a minute.");

    try {
      const response = await fetch("/api/tools/hdr-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video: originalVideo,
          settings: {
            intensity,
            saturation,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process video");
      }

      const data = await response.json();
      setProcessedVideo(data.video);
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process video");
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadVideo = async () => {
    if (!processedVideo) return;

    try {
      // Fetch the video from CDN and create a blob for download
      const response = await fetch(processedVideo);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "hdr-video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch {
      // Fallback to direct link if fetch fails
      window.open(processedVideo, "_blank");
    }
  };

  const resetAll = () => {
    setOriginalVideo(null);
    setProcessedVideo(null);
    setError(null);
    setProgress(null);
    setIntensity(1.5);
    setSaturation(1.0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Seo
        title="HDR Video Generator for Instagram & Facebook"
        description="Make your Instagram Reels and Facebook videos glow on HDR screens. Create eye-catching content that stands out."
      />

      <HDRNavbar />

      <main className="pt-16 sm:pt-20 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12 relative">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                {/* Left - Text Content */}
                <div className="text-center lg:text-left order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Video className="w-4 h-4" />
                    Video HDR
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Make Your Videos{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                      Glow
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0">
                    Add HDR effects to your videos for Instagram Reels and Facebook.
                    They&apos;ll shine brighter on HDR displays like iPhones and Macs.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                    <Button
                      onClick={scrollToUpload}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-5 sm:px-12 sm:py-6 lg:px-14 lg:py-7 text-lg sm:text-xl rounded-xl shadow-lg shadow-purple-500/25 font-semibold"
                    >
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Upload Your Video
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
                    </Button>
                  </div>

                  {/* Feature pills */}
                  <div className="hidden sm:flex flex-wrap gap-2 justify-center lg:justify-start">
                    {["Instagram Reels", "Facebook Video", "HDR10 format"].map(
                      (feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400"
                        >
                          {feature}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Right - Mockup */}
                <div className="order-1 lg:order-2">
                  <div className="relative max-w-sm mx-auto">
                    {/* Glow effect behind card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl scale-110" />

                    <div className="relative">
                      <FacebookVideoMockup videoSrc="/hdr-video-demo.mp4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section ref={uploadSectionRef} className="bg-gray-900 pt-8 sm:pt-12 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Create Your HDR Video
                </h2>
                <p className="text-gray-400">
                  Upload any video for Instagram Reels or Facebook
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column - Upload & Settings */}
                <div className="space-y-5">
                  {/* Upload Area */}
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer backdrop-blur-sm",
                      isDragging
                        ? "border-purple-500 bg-purple-500/20"
                        : originalVideo
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-gray-700 hover:border-purple-500/50 hover:bg-white/5 bg-gray-800/50"
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !originalVideo && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                    {originalVideo ? (
                      <div className="space-y-4">
                        <div className="relative inline-block w-full">
                          <video
                            src={originalVideo}
                            controls
                            className="max-h-56 sm:max-h-64 rounded-xl mx-auto shadow-lg"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resetAll();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 z-10 shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4">
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20">
                          <Video className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white">
                            Drop your video here
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            or click to browse
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          MP4, MOV, WebM up to 50MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* HDR Settings */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Glow Settings
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-sm font-medium text-gray-300">
                            Brightness Boost
                          </Label>
                          <span className="text-sm text-gray-400 font-mono">
                            {intensity.toFixed(2)}x
                          </span>
                        </div>
                        <Slider
                          value={[intensity]}
                          onValueChange={([v]) => setIntensity(v)}
                          min={1}
                          max={4}
                          step={0.1}
                          className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-300"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Higher = brighter glow effect
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-sm font-medium text-gray-300">
                            Saturation
                          </Label>
                          <span className="text-sm text-gray-400 font-mono">
                            {saturation.toFixed(2)}x
                          </span>
                        </div>
                        <Slider
                          value={[saturation]}
                          onValueChange={([v]) => setSaturation(v)}
                          min={0.5}
                          max={2}
                          step={0.05}
                          className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-300"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Adjust color intensity separately
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Process Button */}
                  <Button
                    onClick={processVideo}
                    disabled={!originalVideo || isProcessing}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-purple-500/20"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Create HDR Video
                      </>
                    )}
                  </Button>

                  {progress && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-purple-400 text-sm">
                      {progress}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </div>

                {/* Right Column - Result */}
                <div className="space-y-5">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-700 min-h-[300px] sm:min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Preview
                    </h3>

                    <div className="flex-1 flex items-center justify-center">
                      {processedVideo ? (
                        <div className="w-full space-y-4">
                          <FacebookVideoMockup videoSrc={processedVideo} hideOverlay />
                          <p className="text-center text-sm text-gray-400">
                            HDR10 metadata embedded
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="bg-gray-700/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600">
                            <Video className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-gray-500">
                            Upload a video to see
                            <br />
                            your HDR video
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Download Button */}
                  {processedVideo && (
                    <Button
                      onClick={downloadVideo}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg rounded-xl shadow-lg shadow-green-500/20"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download HDR Video
                    </Button>
                  )}

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-5 sm:p-6 border border-purple-500/20">
                    <h4 className="font-semibold text-white mb-3">
                      Tips for best results
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li className="flex gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        Upload to Instagram Reels or Facebook for HDR playback
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        Viewers on iPhone/iPad will see the HDR glow effect
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        Videos with bright scenes and colors work best
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

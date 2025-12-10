import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Download,
  Sparkles,
  X,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  ArrowDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { HDRNavbar } from "@/components/HDRNavbar";
import { cn } from "@/lib/utils";

const HDR_LEVELS = 9; // 0-8

// Twitter Post Mockup Component
function TwitterPostMockup({
  postImage,
  hdrLevel,
  compact = false,
}: {
  postImage: string | null;
  hdrLevel: number;
  compact?: boolean;
}) {
  const displayImage = postImage || `/hero-hdr-${hdrLevel}.png`;

  return (
    <div className={cn(
      "bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200",
      compact && "scale-[0.97] origin-top"
    )}>
      {/* Post header */}
      <div className={cn(
        "flex items-start gap-2 sm:gap-3",
        compact ? "p-3" : "p-3 sm:p-4"
      )}>
        <div className={cn(
          "rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0",
          compact ? "w-8 h-8" : "w-9 h-9 sm:w-10 sm:h-10"
        )} />
        <div className="flex-1 min-w-0">
          <div className={cn(
            "flex items-center gap-1 flex-wrap",
            compact ? "text-xs" : "text-xs sm:text-sm"
          )}>
            <span className="font-bold text-gray-900">Your Name</span>
            <span className="text-gray-500">@username</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">2h</span>
          </div>
          <p className={cn(
            "text-gray-900 mt-0.5 sm:mt-1",
            compact ? "text-xs" : "text-xs sm:text-sm"
          )}>
            Check out this HDR photo! It looks amazing on HDR screens.
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <MoreHorizontal className={cn(compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5")} />
        </button>
      </div>

      {/* Post image */}
      <div className={cn(
        "pb-2 sm:pb-3",
        compact ? "px-3" : "px-3 sm:px-4"
      )}>
        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={displayImage}
            alt="Post"
            className="w-full object-cover"
            style={{ maxHeight: compact ? "250px" : "350px" }}
          />
        </div>
      </div>

      {/* Post actions */}
      <div className={cn(
        "flex justify-between text-gray-500",
        compact ? "px-3 pb-3 text-xs" : "px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm"
      )}>
        <button className="flex items-center gap-1 sm:gap-2 hover:text-blue-500 transition-colors">
          <MessageCircle className={cn(compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5")} />
          <span>24</span>
        </button>
        <button className="flex items-center gap-1 sm:gap-2 hover:text-green-500 transition-colors">
          <Repeat2 className={cn(compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5")} />
          <span>12</span>
        </button>
        <button className="flex items-center gap-1 sm:gap-2 hover:text-pink-500 transition-colors">
          <Heart className={cn(compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5")} />
          <span>486</span>
        </button>
        <button className="flex items-center gap-1 sm:gap-2 hover:text-blue-500 transition-colors">
          <Share className={cn(compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5")} />
        </button>
      </div>
    </div>
  );
}

export default function HDRGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // HDR preview slider for hero
  const [heroHdrLevel, setHeroHdrLevel] = useState(0);

  // HDR settings
  const [hdrIntensity, setHdrIntensity] = useState(1.5);
  const [gamma, setGamma] = useState(0.4);
  const [optimizeForTwitter, setOptimizeForTwitter] = useState(true); // Helps Twitter preserve HDR

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
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

  const processImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/tools/hdr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          settings: {
            hdrIntensity,
            gamma,
            // Twitter seems to strip HDR from large images - constraining to 4096px helps
            maxDimension: optimizeForTwitter ? 4096 : undefined,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process image");
      }

      const data = await response.json();
      setProcessedImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = async () => {
    if (!processedImage) return;

    try {
      // Fetch from CDN URL and create blob for download
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "hdr-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(processedImage, "_blank");
    }
  };

  const resetAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setHdrIntensity(1.5);
    setGamma(0.4);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Seo
        title="HDR Photo Generator for Twitter/X Posts"
        description="Make your Twitter photos glow on HDR screens. Create eye-catching posts that stand out in the feed."
      />

      <HDRNavbar />

      <main className="pt-16 sm:pt-20 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12 relative">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                {/* Left - Text Content */}
                <div className="text-center lg:text-left order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Photo HDR
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Make Your Posts{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      Shine
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0">
                    Add HDR effects to any photo. Your images will glow brighter
                    than regular photos on HDR displays.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                    <Button
                      onClick={scrollToUpload}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-5 sm:px-12 sm:py-6 lg:px-14 lg:py-7 text-lg sm:text-xl rounded-xl shadow-lg shadow-blue-500/25 font-semibold"
                    >
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Upload Your Photo
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
                    </Button>
                  </div>

                  {/* Feature pills */}
                  <div className="hidden sm:flex flex-wrap gap-2 justify-center lg:justify-start">
                    {["Original size kept", "Works on iPhone", "Instant download"].map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right - Interactive Demo */}
                <div className="order-1 lg:order-2">
                  <div className="relative max-w-sm mx-auto">
                    {/* Glow effect behind card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl scale-110" />

                    <div className="relative">
                      <TwitterPostMockup postImage={null} hdrLevel={heroHdrLevel} compact />

                      {/* Slider below mockup */}
                      <div className="mt-4 px-2">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Normal</span>
                            <span className="text-blue-400 font-medium">
                              {heroHdrLevel === 0 ? "No HDR" : `Level ${heroHdrLevel}`}
                            </span>
                            <span>Max</span>
                          </div>
                          <Slider
                            value={[heroHdrLevel]}
                            onValueChange={([v]) => setHeroHdrLevel(v)}
                            min={0}
                            max={HDR_LEVELS - 1}
                            step={1}
                            className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg"
                          />
                          <p className="text-center text-xs text-gray-500 mt-2">
                            Drag to preview HDR effect
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section
          ref={uploadSectionRef}
          className="bg-gray-900 pt-8 sm:pt-12 pb-16"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Create Your HDR Photo
                </h2>
                <p className="text-gray-400">
                  Upload any photo and we&apos;ll add the HDR magic
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
                        ? "border-blue-500 bg-blue-500/20"
                        : originalImage
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-gray-700 hover:border-blue-500/50 hover:bg-white/5 bg-gray-800/50"
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !originalImage && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                    {originalImage ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <img
                            src={originalImage}
                            alt="Original"
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
                        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
                          <Upload className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white">
                            Drop your photo here
                          </p>
                          <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WebP up to 10MB
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
                          <Label className="text-sm font-medium text-gray-300">Brightness</Label>
                          <span className="text-sm text-gray-400 font-mono">
                            {hdrIntensity.toFixed(2)}
                          </span>
                        </div>
                        <Slider
                          value={[hdrIntensity]}
                          onValueChange={([v]) => setHdrIntensity(v)}
                          min={1}
                          max={3}
                          step={0.05}
                          className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-300"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Higher = brighter glow
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-sm font-medium text-gray-300">Highlight Pop</Label>
                          <span className="text-sm text-gray-400 font-mono">
                            {gamma.toFixed(2)}
                          </span>
                        </div>
                        <Slider
                          value={[gamma]}
                          onValueChange={([v]) => setGamma(v)}
                          min={0.3}
                          max={1.5}
                          step={0.05}
                          className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-300"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Lower = more intense highlights
                        </p>
                      </div>

                      {/* Twitter optimization toggle */}
                      <div className="pt-2 border-t border-gray-700">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={optimizeForTwitter}
                            onChange={(e) => setOptimizeForTwitter(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-300">Optimize for Twitter</span>
                            <p className="text-xs text-gray-500">Constrains size to help Twitter preserve HDR effect</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Process Button */}
                  <Button
                    onClick={processImage}
                    disabled={!originalImage || isProcessing}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Create HDR Photo
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </div>

                {/* Right Column - Result */}
                <div className="space-y-5">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-700 min-h-[300px] sm:min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>

                    <div className="flex-1 flex items-center justify-center">
                      {processedImage ? (
                        <div className="w-full space-y-4">
                          <TwitterPostMockup
                            postImage={processedImage}
                            hdrLevel={0}
                            compact
                          />
                          <p className="text-center text-sm text-gray-400">
                            Original size preserved • HDR ready
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="bg-gray-700/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600">
                            <Sparkles className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-gray-500">
                            Upload a photo to see<br />your HDR image
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Download Button */}
                  {processedImage && (
                    <Button
                      onClick={downloadImage}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg rounded-xl shadow-lg shadow-green-500/20"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download HDR Photo
                    </Button>
                  )}

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-5 sm:p-6 border border-blue-500/20">
                    <h4 className="font-semibold text-white mb-3">
                      Tips for best results
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li className="flex gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        Works on iPhone, Mac, iPad, and HDR displays
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        Photos with bright colors work best
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        Sunsets, neon lights, and colorful scenes look amazing
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

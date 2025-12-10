import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Download, Sparkles, X, Move, ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { HDRNavbar } from "@/components/HDRNavbar";
import { cn } from "@/lib/utils";

const HDR_LEVELS = 9; // 0-8

// Twitter Profile Header Mockup Component
function TwitterProfileMockup({
  profileImage,
  hdrLevel,
  compact = false,
}: {
  profileImage: string | null;
  hdrLevel: number;
  compact?: boolean;
}) {
  const displayImage = profileImage || `/hero-hdr-${hdrLevel}.png`;

  return (
    <div className={cn(
      "bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200",
      compact && "scale-95 origin-top"
    )}>
      {/* Banner */}
      <div className={cn(
        "bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 relative",
        compact ? "h-20" : "h-24 sm:h-32"
      )} />

      {/* Profile section */}
      <div className={cn("px-3 sm:px-4 pb-3 sm:pb-4", compact && "px-3 pb-3")}>
        {/* Profile picture - overlapping banner */}
        <div className={cn(
          "relative mb-2 sm:mb-3",
          compact ? "-mt-10" : "-mt-12 sm:-mt-16"
        )}>
          <div className={cn(
            "rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg",
            compact ? "w-20 h-20" : "w-24 h-24 sm:w-32 sm:h-32"
          )}>
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile info */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className={cn(
              "font-bold text-gray-900 truncate",
              compact ? "text-base" : "text-lg sm:text-xl"
            )}>Your Name</h3>
            <p className={cn(
              "text-gray-500",
              compact ? "text-xs" : "text-sm"
            )}>@username</p>
          </div>
          <button className={cn(
            "bg-gray-900 text-white rounded-full font-semibold whitespace-nowrap flex-shrink-0",
            compact ? "px-3 py-1 text-xs" : "px-3 sm:px-4 py-1.5 text-xs sm:text-sm"
          )}>
            Edit profile
          </button>
        </div>

        {/* Bio - hide on compact */}
        {!compact && (
          <p className="mt-2 sm:mt-3 text-gray-700 text-xs sm:text-sm line-clamp-2">
            Your bio goes here. This is how your HDR profile picture will look on Twitter/X.
          </p>
        )}

        {/* Stats */}
        <div className={cn(
          "flex gap-3 sm:gap-4 text-xs sm:text-sm",
          compact ? "mt-2" : "mt-2 sm:mt-3"
        )}>
          <span>
            <strong className="text-gray-900">123</strong>{" "}
            <span className="text-gray-500">Following</span>
          </span>
          <span>
            <strong className="text-gray-900">456</strong>{" "}
            <span className="text-gray-500">Followers</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TwitterHDRGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // HDR preview slider for hero
  const [heroHdrLevel, setHeroHdrLevel] = useState(0);

  // Crop position as percentage (0-1) along the axis that needs cropping
  const [cropOffset, setCropOffset] = useState(0.5);
  const [isCropDragging, setIsCropDragging] = useState(false);

  // HDR settings
  const [hdrIntensity, setHdrIntensity] = useState(1.5);
  const [gamma, setGamma] = useState(0.4);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Load image dimensions when image changes
  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = originalImage;
    } else {
      setImageSize(null);
    }
  }, [originalImage]);

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
      setCropOffset(0.5);
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

  // Handle crop dragging
  const handleCropMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsCropDragging(true);
  }, []);

  const handleCropMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isCropDragging || !imageRef.current || !imageSize) return;

      const rect = imageRef.current.getBoundingClientRect();
      const isWideImg = imageSize.width > imageSize.height;

      if (isWideImg) {
        const x = e.clientX - rect.left;
        const maxOffset = rect.width - rect.height;
        if (maxOffset > 0) {
          const offset = Math.max(0, Math.min(1, x / rect.width));
          const cropBoxRatio = rect.height / rect.width;
          const maxCropOffset = 1 - cropBoxRatio;
          setCropOffset(
            Math.max(0, Math.min(maxCropOffset, offset - cropBoxRatio / 2)) /
              maxCropOffset
          );
        }
      } else {
        const y = e.clientY - rect.top;
        const maxOffset = rect.height - rect.width;
        if (maxOffset > 0) {
          const offset = Math.max(0, Math.min(1, y / rect.height));
          const cropBoxRatio = rect.width / rect.height;
          const maxCropOffset = 1 - cropBoxRatio;
          setCropOffset(
            Math.max(0, Math.min(maxCropOffset, offset - cropBoxRatio / 2)) /
              maxCropOffset
          );
        }
      }
    },
    [isCropDragging, imageSize]
  );

  const handleCropMouseUp = useCallback(() => {
    setIsCropDragging(false);
  }, []);

  useEffect(() => {
    if (isCropDragging) {
      window.addEventListener("mousemove", handleCropMouseMove);
      window.addEventListener("mouseup", handleCropMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleCropMouseMove);
        window.removeEventListener("mouseup", handleCropMouseUp);
      };
    }
  }, [isCropDragging, handleCropMouseMove, handleCropMouseUp]);

  const processImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/tools/twitter-hdr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          settings: {
            hdrIntensity,
            gamma,
            cropOffset,
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
      link.download = "twitter-hdr-profile.png";
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
    setImageSize(null);
    setProcessedImage(null);
    setError(null);
    setHdrIntensity(1.5);
    setGamma(0.4);
    setCropOffset(0.5);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const needsCropping = imageSize && imageSize.width !== imageSize.height;
  const isWide = imageSize && imageSize.width > imageSize.height;

  const getCropBoxStyle = (): React.CSSProperties => {
    if (!imageSize || !needsCropping) return {};

    const aspectRatio = isWide
      ? imageSize.height / imageSize.width
      : imageSize.width / imageSize.height;

    if (isWide) {
      const maxOffset = 1 - aspectRatio;
      const leftPercent = cropOffset * maxOffset * 100;
      return {
        position: "absolute",
        left: `${leftPercent}%`,
        top: 0,
        width: `${aspectRatio * 100}%`,
        height: "100%",
        border: "3px solid #f97316",
        borderRadius: "8px",
        boxSizing: "border-box",
        cursor: "move",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
      };
    } else {
      const maxOffset = 1 - aspectRatio;
      const topPercent = cropOffset * maxOffset * 100;
      return {
        position: "absolute",
        left: 0,
        top: `${topPercent}%`,
        width: "100%",
        height: `${aspectRatio * 100}%`,
        border: "3px solid #f97316",
        borderRadius: "8px",
        boxSizing: "border-box",
        cursor: "move",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
      };
    }
  };

  const getOverlayStyle = (
    position: "before" | "after"
  ): React.CSSProperties => {
    if (!imageSize || !needsCropping) return { display: "none" };

    const aspectRatio = isWide
      ? imageSize.height / imageSize.width
      : imageSize.width / imageSize.height;

    const maxOffset = 1 - aspectRatio;
    const offset = cropOffset * maxOffset;

    if (isWide) {
      if (position === "before") {
        return {
          position: "absolute",
          left: 0,
          top: 0,
          width: `${offset * 100}%`,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
        };
      } else {
        return {
          position: "absolute",
          left: `${(offset + aspectRatio) * 100}%`,
          top: 0,
          width: `${(1 - offset - aspectRatio) * 100}%`,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
        };
      }
    } else {
      if (position === "before") {
        return {
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: `${offset * 100}%`,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
        };
      } else {
        return {
          position: "absolute",
          left: 0,
          top: `${(offset + aspectRatio) * 100}%`,
          width: "100%",
          height: `${(1 - offset - aspectRatio) * 100}%`,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
        };
      }
    }
  };

  return (
    <>
      <Seo
        title="HDR Profile Picture Generator for Twitter/X"
        description="Make your Twitter profile picture glow on HDR screens. Creates eye-catching profile photos that stand out in the feed."
        image="https://xhdr.org/xhdr-og.png"
      />

      <HDRNavbar />

      <main className="pt-16 sm:pt-20 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12 relative">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                {/* Left - Text Content */}
                <div className="text-center lg:text-left order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Profile Picture HDR
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Make Your Profile{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                      Glow
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-xl mx-auto lg:mx-0">
                    Create a profile picture that literally glows on HDR screens.
                    Stand out from everyone else in the feed.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                    <Button
                      onClick={scrollToUpload}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-5 sm:px-12 sm:py-6 lg:px-14 lg:py-7 text-lg sm:text-xl rounded-xl shadow-lg shadow-orange-500/25 font-semibold"
                    >
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Upload Your Photo
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
                    </Button>
                  </div>

                  {/* Feature pills */}
                  <div className="hidden sm:flex flex-wrap gap-2 justify-center lg:justify-start">
                    {["Works on iPhone", "Mac & iPad", "Dark mode ready"].map((feature) => (
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
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-pink-500/30 blur-2xl scale-110" />

                    <div className="relative">
                      <TwitterProfileMockup
                        profileImage={null}
                        hdrLevel={heroHdrLevel}
                        compact
                      />

                      {/* Slider below mockup */}
                      <div className="mt-4 px-2">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Normal</span>
                            <span className="text-orange-400 font-medium">
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
                            className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg"
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
                  Create Your HDR Profile Picture
                </h2>
                <p className="text-gray-400">
                  Upload your photo and we&apos;ll add the HDR magic
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
                        ? "border-orange-500 bg-orange-500/20"
                        : originalImage
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-gray-700 hover:border-orange-500/50 hover:bg-white/5 bg-gray-800/50"
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
                        <div
                          ref={imageContainerRef}
                          className="relative inline-block select-none"
                        >
                          <img
                            ref={imageRef}
                            src={originalImage}
                            alt="Original"
                            className="max-h-56 sm:max-h-64 rounded-xl mx-auto shadow-lg"
                            draggable={false}
                          />
                          {needsCropping && (
                            <>
                              <div style={getOverlayStyle("before")} />
                              <div style={getOverlayStyle("after")} />
                              <div
                                style={getCropBoxStyle()}
                                onMouseDown={handleCropMouseDown}
                                className="flex items-center justify-center"
                              >
                                <div className="bg-white/90 rounded-full p-2 shadow-lg">
                                  <Move className="w-5 h-5 text-orange-600" />
                                </div>
                              </div>
                            </>
                          )}
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
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">
                            {imageSize &&
                              `${imageSize.width} × ${imageSize.height}px`}
                          </p>
                          {needsCropping && (
                            <p className="text-xs text-orange-400 font-medium">
                              Drag the box to select crop area
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4">
                        <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/20">
                          <Upload className="w-8 h-8 text-orange-400" />
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
                          className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-orange-300"
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
                          className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-orange-300"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                          Lower = more intense highlights
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Process Button */}
                  <Button
                    onClick={processImage}
                    disabled={!originalImage || isProcessing}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-orange-500/20"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Create HDR Profile Picture
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
                          <TwitterProfileMockup
                            profileImage={processedImage}
                            hdrLevel={0}
                            compact
                          />
                          <p className="text-center text-sm text-gray-400">
                            400 × 400px • Ready for Twitter/X
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                            <Sparkles className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-gray-500">
                            Upload a photo to see<br />your HDR profile picture
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
                      Download Profile Picture
                    </Button>
                  )}

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-2xl p-5 sm:p-6 border border-orange-500/20">
                    <h4 className="font-semibold text-white mb-3">
                      Tips for best results
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li className="flex gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        Works on iPhone, Mac, iPad, and HDR displays
                      </li>
                      <li className="flex gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        Photos with bright colors work best
                      </li>
                      <li className="flex gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        Your profile will stand out in dark mode
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

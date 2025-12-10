import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { Upload, Download, Sparkles, Info, X, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

export default function TwitterHDRGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Crop position as percentage (0-1) along the axis that needs cropping
  const [cropOffset, setCropOffset] = useState(0.5); // 0 = start, 0.5 = center, 1 = end
  const [isCropDragging, setIsCropDragging] = useState(false);

  // HDR settings
  const [hdrIntensity, setHdrIntensity] = useState(1.5);
  const [gamma, setGamma] = useState(0.4);

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

  const handleCropMouseMove = useCallback((e: MouseEvent) => {
    if (!isCropDragging || !imageRef.current || !imageSize) return;

    const rect = imageRef.current.getBoundingClientRect();
    const isWide = imageSize.width > imageSize.height;

    if (isWide) {
      // Horizontal image - drag left/right
      const x = e.clientX - rect.left;
      const maxOffset = rect.width - rect.height;
      if (maxOffset > 0) {
        const offset = Math.max(0, Math.min(1, x / rect.width));
        // Clamp so the crop box stays within bounds
        const cropBoxRatio = rect.height / rect.width;
        const maxCropOffset = 1 - cropBoxRatio;
        setCropOffset(Math.max(0, Math.min(maxCropOffset, offset - cropBoxRatio / 2)) / maxCropOffset);
      }
    } else {
      // Vertical image - drag up/down
      const y = e.clientY - rect.top;
      const maxOffset = rect.height - rect.width;
      if (maxOffset > 0) {
        const offset = Math.max(0, Math.min(1, y / rect.height));
        const cropBoxRatio = rect.width / rect.height;
        const maxCropOffset = 1 - cropBoxRatio;
        setCropOffset(Math.max(0, Math.min(maxCropOffset, offset - cropBoxRatio / 2)) / maxCropOffset);
      }
    }
  }, [isCropDragging, imageSize]);

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

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "twitter-hdr-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Check if image needs cropping (not already square)
  const needsCropping = imageSize && imageSize.width !== imageSize.height;
  const isWide = imageSize && imageSize.width > imageSize.height;

  // Calculate crop box style for preview
  const getCropBoxStyle = (): React.CSSProperties => {
    if (!imageSize || !needsCropping) return {};

    const aspectRatio = isWide
      ? imageSize.height / imageSize.width
      : imageSize.width / imageSize.height;

    if (isWide) {
      // Horizontal image
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
      // Vertical image
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

  // Overlay style for non-cropped areas
  const getOverlayStyle = (position: "before" | "after"): React.CSSProperties => {
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
        title="Twitter HDR Image Generator - Make Your Photos Pop"
        description="Create HDR images optimized for Twitter. Resize to 400x400, add transparency to force PNG, and apply HDR effects for maximum visual impact."
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            X<span className="text-orange-500">HDR</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/tools/twitter-hdr"
              className="text-orange-500 font-medium"
            >
              Twitter HDR
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Twitter HDR Generator
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Make Your Twitter Photos{" "}
              <span className="text-orange-500">Pop</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create HDR images that stand out in Twitter feeds. Automatically
              resized to 400x400 with transparency to force PNG format.
            </p>
          </div>

          {/* Info Box */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Images are resized to 400x400px and processed in 16-bit color</li>
                  <li>Rec. 2020 wide color gamut ICC profile is embedded</li>
                  <li>A tiny transparent border forces Twitter to keep PNG format</li>
                  <li>HDR displays will show extra brightness and vibrance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Left Column - Upload & Settings */}
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center transition-colors",
                  isDragging
                    ? "border-orange-500 bg-orange-50"
                    : originalImage
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/50 cursor-pointer"
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
                        className="max-h-72 rounded-lg mx-auto"
                        draggable={false}
                      />
                      {needsCropping && (
                        <>
                          {/* Dark overlays for non-selected areas */}
                          <div style={getOverlayStyle("before")} />
                          <div style={getOverlayStyle("after")} />
                          {/* Draggable crop box */}
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
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        {imageSize && `${imageSize.width} × ${imageSize.height}px`}
                      </p>
                      {needsCropping && (
                        <p className="text-xs text-orange-600 font-medium">
                          Drag the box to select crop area
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your image here
                      </p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB</p>
                  </div>
                )}
              </div>

              {/* HDR Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  HDR Settings
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm font-medium">Intensity (Multiply)</Label>
                      <span className="text-sm text-gray-500">{hdrIntensity.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[hdrIntensity]}
                      onValueChange={([v]) => setHdrIntensity(v)}
                      min={1}
                      max={3}
                      step={0.05}
                      className="[&_[role=slider]]:bg-orange-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Boosts brightness. Default: 1.5</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm font-medium">Gamma (Pow)</Label>
                      <span className="text-sm text-gray-500">{gamma.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[gamma]}
                      onValueChange={([v]) => setGamma(v)}
                      min={0.3}
                      max={1.5}
                      step={0.05}
                      className="[&_[role=slider]]:bg-orange-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Lower = brighter highlights. Default: 0.4</p>
                  </div>
                </div>
              </div>

              {/* Process Button */}
              <Button
                onClick={processImage}
                disabled={!originalImage || isProcessing}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate HDR Image
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Result */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
                <div className="flex-1 flex items-center justify-center">
                  {processedImage ? (
                    <div className="space-y-4 w-full">
                      <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                        <img
                          src={processedImage}
                          alt="Processed HDR"
                          className="max-w-full rounded-lg shadow-lg"
                          style={{ imageRendering: "auto" }}
                        />
                      </div>
                      <div className="text-center text-sm text-gray-500">
                        400 × 400 px • PNG with transparency
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="bg-gray-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-10 h-10 text-gray-300" />
                      </div>
                      <p>Your HDR image will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button */}
              {processedImage && (
                <Button
                  onClick={downloadImage}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download HDR Image
                </Button>
              )}

              {/* Tips */}
              <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-2xl p-6 border border-purple-100">
                <h4 className="font-semibold text-gray-900 mb-3">Tips for best results:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    Works best on Mac/iPhone with HDR displays
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    The Rec. 2020 profile makes colors appear &quot;glowing&quot; on HDR screens
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    Increase intensity for more dramatic HDR glow effect
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    Lower gamma brightens highlights without clipping
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

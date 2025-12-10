import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Sparkles,
  Upload,
  Download,
  Loader2,
  ImageIcon,
  Wand2,
  X,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Seo from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { routes } from "@/lib/constants";
import { trpc } from "@/utils/trpc";

const AD_TYPES = [
  { value: "PRODUCT_AD", label: "Product Ad" },
  { value: "SOCIAL_MEDIA", label: "Social Media" },
  { value: "BANNER", label: "Banner Ad" },
  { value: "PROMOTIONAL", label: "Promotional" },
];

const ASPECT_RATIOS = [
  { value: "1:1", label: "Square (1:1)", width: 1024, height: 1024 },
  { value: "16:9", label: "Landscape (16:9)", width: 1024, height: 576 },
  { value: "9:16", label: "Portrait (9:16)", width: 576, height: 1024 },
  { value: "4:5", label: "Instagram (4:5)", width: 864, height: 1080 },
];

export default function AdGeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState("");
  const [adType, setAdType] = useState("PRODUCT_AD");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: userData, refetch: refetchUser } = trpc.user.me.useQuery(
    undefined,
    {
      enabled: !!session,
    }
  );

  const generateMutation = trpc.adGeneration.generate.useMutation({
    onSuccess: (data: { imageUrls: string[] }) => {
      setGeneratedImages(data.imageUrls);
      refetchUser();
      toast.success("Ad generated successfully!");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const uploadMutation = trpc.upload.getPresignedUrl.useMutation();
  const saveImageMutation = trpc.upload.saveUploadedImage.useMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const { presignedUrl, key, publicUrl } = await uploadMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
      });

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // Save uploaded image to database and get the ID
      const savedImage = await saveImageMutation.mutateAsync({
        url: publicUrl,
        key,
        size: file.size,
        mimeType: file.type,
      });

      setUploadedImage(publicUrl);
      setUploadedImageId(savedImage.id);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!session) {
      router.push(routes.auth.login);
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if ((userData?.credits ?? 0) < 5) {
      toast.error("Not enough credits. Please upgrade your plan.");
      return;
    }

    const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio);

    setIsGenerating(true);
    generateMutation.mutate({
      prompt: prompt.trim(),
      adType: adType as "PRODUCT_AD" | "SOCIAL_MEDIA" | "BANNER" | "PROMOTIONAL",
      width: selectedRatio?.width ?? 1024,
      height: selectedRatio?.height ?? 1024,
      inputImageId: uploadedImageId ?? undefined,
    });
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ad-${Date.now()}-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Seo
        title="AI Ad Generator - AdMake AI"
        description="Generate stunning advertisement images with AI. Create product ads, social media graphics, and banners in seconds."
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            AdMake<span className="text-orange-500">AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={routes.tools.adGenerator}
              className="text-orange-500 font-medium"
            >
              Tools
            </Link>
            <Link
              href={routes.common.pricing}
              className="text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{userData?.credits ?? 0} credits</span>
                </div>
                <Link href={routes.common.dashboard}>
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href={routes.auth.login}>
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href={routes.auth.register}>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                AI Ad Generator
              </h1>
              <p className="text-gray-600">
                Create stunning advertisement images with the power of AI
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Panel - Controls */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                {/* Prompt Input */}
                <div>
                  <Label htmlFor="prompt" className="text-base font-medium">
                    Describe your ad
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="A sleek modern smartphone on a gradient background with dynamic lighting, professional product photography, marketing ad style..."
                    className="mt-2 min-h-[120px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Be specific about your product, style, colors, and mood
                  </p>
                </div>

                {/* Ad Type */}
                <div>
                  <Label className="text-base font-medium">Ad Type</Label>
                  <Select value={adType} onValueChange={setAdType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <Label className="text-base font-medium">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIOS.map((ratio) => (
                        <SelectItem key={ratio.value} value={ratio.value}>
                          {ratio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reference Image Upload */}
                <div>
                  <Label className="text-base font-medium">
                    Reference Image (Optional)
                  </Label>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    Upload a product image to edit or use as reference
                  </p>
                  {uploadedImage ? (
                    <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Uploaded reference"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={clearUploadedImage}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 mx-auto text-orange-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Ad (5 credits)
                    </>
                  )}
                </Button>

                {!session && (
                  <p className="text-center text-sm text-gray-500">
                    <Link
                      href={routes.auth.register}
                      className="text-orange-500 hover:underline"
                    >
                      Sign up
                    </Link>{" "}
                    to get 25 free credits
                  </p>
                )}
              </div>

              {/* Right Panel - Results */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Generated Ads
                </h2>

                {generatedImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {generatedImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={imageUrl}
                          alt={`Generated ad ${index + 1}`}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(imageUrl, index)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mb-4" />
                    <p className="text-center">
                      Your generated ads will appear here
                    </p>
                    <p className="text-sm text-center mt-2">
                      Enter a prompt and click Generate to start
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mt-12">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Need inspiration? Try these prompts:
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  "Premium wireless earbuds floating on a dark gradient background with neon accent lights, sleek product photography",
                  "Luxury skincare bottle on marble surface with soft natural lighting, elegant minimalist composition, beauty ad",
                  "Fresh organic juice bottle surrounded by colorful fruits splashing, vibrant and energetic food advertisement",
                ].map((examplePrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(examplePrompt)}
                    className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all"
                  >
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {examplePrompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

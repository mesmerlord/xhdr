import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Eye,
  Palette,
  Circle,
  Camera,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogLayout } from "@/components/layout/BlogLayout";

const CDN_BASE = "https://images.xhdr.org/public_media";

const POST_DATA = {
  title: "Twitter Profile Pictures That Get Noticed",
  description:
    "Research-backed tips for X/Twitter profile pictures that get noticed. From color psychology to the technical specs that prevent blurry avatars.",
  date: "2025-12-13",
  readTime: "5 min",
  category: "Tips",
  image: `${CDN_BASE}/blog-images/profile-picture-tips-hero.jpg`,
};

// Example profile pictures with gradient backgrounds
const EXAMPLE_PROFILES = [
  { src: `${CDN_BASE}/example-profiles/profile-woman-1.jpg`, bg: "from-orange-400 to-pink-500" },
  { src: `${CDN_BASE}/example-profiles/profile-man-1.jpg`, bg: "from-blue-400 to-purple-500" },
  { src: `${CDN_BASE}/example-profiles/profile-woman-2.jpg`, bg: "from-red-400 to-orange-500" },
  { src: `${CDN_BASE}/example-profiles/profile-man-2.jpg`, bg: "from-cyan-400 to-blue-500" },
];

export default function TwitterProfilePictureTips() {
  return (
    <BlogLayout post={POST_DATA}>
      <div className="space-y-12 text-gray-300 text-lg leading-relaxed">
        {/* Example Profiles Grid */}
        <section>
          <p className="text-xl text-gray-400 mb-6">
            Your profile picture is a 400×400 pixel first impression. Here&apos;s
            what research says about making those pixels count.
          </p>
          <div className="grid grid-cols-4 gap-3 my-8">
            {EXAMPLE_PROFILES.map((profile, i) => (
              <div
                key={i}
                className={`aspect-square rounded-full overflow-hidden bg-gradient-to-br ${profile.bg} p-1`}
              >
                <img
                  src={profile.src}
                  alt={`Example profile ${i + 1}`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ))}
          </div>
        </section>

        {/* The Science of Color */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Palette className="w-6 h-6 text-orange-400" />
            The Color Advantage
          </h2>
          <p className="mb-4">
            Twitter, Facebook, and LinkedIn all use blue heavily in their
            interfaces. This creates an opportunity:{" "}
            <strong className="text-white">wear warm colors</strong>.
          </p>
          <p className="mb-4">
            Orange, red, and yellow stand out against blue backgrounds. One
            analysis found that profile pictures with a single prominent warm
            color consistently outperformed others in click-through rates.
          </p>
          <div className="grid grid-cols-5 gap-2 my-6">
            <div className="aspect-square rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
            <div className="aspect-square rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
            <div className="aspect-square rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
            <div className="aspect-square rounded-full bg-blue-500 flex items-center justify-center opacity-50">
              <span className="text-white text-xs">—</span>
            </div>
            <div className="aspect-square rounded-full bg-gray-500 flex items-center justify-center opacity-50">
              <span className="text-white text-xs">—</span>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            This doesn&apos;t mean you need an orange shirt. A warm-toned
            background or good lighting can achieve the same effect.
          </p>
        </section>

        {/* Face Forward */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-400" />
            Faces Work Better
          </h2>
          <p className="mb-4">
            Studies consistently show that profile pictures with clear, visible
            faces generate higher engagement than logos, illustrations, or
            photos where the face is obscured.
          </p>
          <p className="mb-4">The specifics that matter:</p>
          <ul className="space-y-2 my-6">
            <li className="flex items-start gap-3">
              <Circle className="w-2 h-2 mt-2 bg-orange-400 rounded-full flex-shrink-0" />
              <span>
                <strong className="text-white">Eyes visible.</strong> People
                look at eyes first. Sunglasses reduce engagement.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Circle className="w-2 h-2 mt-2 bg-orange-400 rounded-full flex-shrink-0" />
              <span>
                <strong className="text-white">Face fills the frame.</strong>{" "}
                Use 60–70% of the circle. Too far away and you&apos;re not
                recognizable.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Circle className="w-2 h-2 mt-2 bg-orange-400 rounded-full flex-shrink-0" />
              <span>
                <strong className="text-white">Simple background.</strong> Busy
                backgrounds compete for attention. Solid colors or blurred
                backgrounds work best.
              </span>
            </li>
          </ul>
        </section>

        {/* Need a Professional Headshot? */}
        <section className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">
            Need a Professional Headshot?
          </h3>
          <p className="text-gray-400 mb-4">
            Don&apos;t have a good photo to start with? AI headshot generators
            can create professional-looking portraits from casual selfies.
            BestPhoto.ai offers AI headshots with 2-hour delivery and costs
            significantly less than a traditional photoshoot.
          </p>
          <div className="flex flex-wrap gap-2 mb-4 text-sm">
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
              2hr Delivery
            </span>
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
              21x More Profile Views
            </span>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
              $200+ Average Savings
            </span>
          </div>
          <a
            href="https://bestphoto.ai/use-cases/professional-headshots"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
          >
            Try BestPhoto AI Headshots
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </section>

        {/* Technical Specs */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Camera className="w-6 h-6 text-purple-400" />
            Avoiding the Blur
          </h2>
          <p className="mb-4">
            Twitter compresses profile pictures to 400×400 pixels and displays
            them in a circle. Upload anything with a different aspect ratio and
            it gets cropped automatically—often badly.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-6">
            <h3 className="font-semibold text-white mb-4">
              Technical Specs for Sharp Profile Pictures
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <strong className="text-white">Size:</strong> 400×400 pixels
                minimum (Twitter&apos;s final size)
              </li>
              <li>
                <strong className="text-white">Aspect ratio:</strong> 1:1
                (square)
              </li>
              <li>
                <strong className="text-white">Format:</strong> PNG or JPG (PNG
                if you have transparency)
              </li>
              <li>
                <strong className="text-white">File size:</strong> Under 2MB
              </li>
            </ul>
          </div>
          <p>
            If your photo is larger than 400×400, Twitter resizes it. If
            it&apos;s smaller, it gets stretched and looks fuzzy. Match the
            specs and you keep full control.
          </p>
        </section>

        {/* The HDR Edge */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-orange-400" />
            The HDR Edge
          </h2>
          <p className="mb-4">
            Most people browsing Twitter are on phones with HDR displays—iPhones,
            high-end Androids. These screens can show brighter, more vibrant
            colors than regular monitors.
          </p>
          <p className="mb-4">
            An HDR profile picture uses this capability. On an HDR screen, your
            avatar appears brighter and more vivid than the non-HDR pictures
            around it. On regular screens, it looks normal.
          </p>

          {/* HDR Example */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-6">
            <h3 className="font-semibold text-white mb-4">Example: HDR vs Standard</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="aspect-square rounded-full overflow-hidden bg-gray-700 mx-auto w-32 mb-2">
                  <img
                    src={`${CDN_BASE}/example-profiles/profile-woman-1.jpg`}
                    alt="Standard profile"
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <span className="text-sm text-gray-500">Standard</span>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 p-0.5 mx-auto w-32 mb-2">
                  <img
                    src={`${CDN_BASE}/example-profiles/profile-woman-1.jpg`}
                    alt="HDR profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-sm text-orange-400">With HDR Glow</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4 text-center">
              On HDR displays, the right image appears noticeably brighter and more vibrant.
            </p>
          </div>

          <p>
            Combined with good color choices and composition, HDR is the
            technical advantage most people aren&apos;t using yet.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Make Your Profile Picture Pop
              </h3>
              <p className="text-gray-400 mb-4">
                Upload your photo and we&apos;ll crop it to 400×400, add HDR for
                that glow effect on modern screens, and give you a file ready
                for Twitter.
              </p>
              <Link href="/tools/twitter-hdr">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  Create HDR Profile Picture
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Checklist */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Quick Checklist</h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-sm">
                  ✓
                </span>
                Warm colors (orange, red, yellow) to stand out against blue UI
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-sm">
                  ✓
                </span>
                Face clearly visible, eyes showing
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-sm">
                  ✓
                </span>
                Simple or blurred background
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-sm">
                  ✓
                </span>
                400×400 pixels, square crop
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-sm">
                  ✓
                </span>
                HDR enabled for extra pop on modern screens
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Related */}
      <div className="mt-16 pt-8 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Related</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/blog/what-is-hdr-profile-picture"
            className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="font-medium text-white mb-1">
              What is an HDR Profile Picture?
            </h4>
            <p className="text-sm text-gray-400">
              Why some avatars glow on your iPhone
            </p>
          </Link>
          <Link
            href="/blog/hdr-effect-explained"
            className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="font-medium text-white mb-1">
              The HDR Effect: Good vs. Overdone
            </h4>
            <p className="text-sm text-gray-400">
              The difference between good HDR and the cringy stuff
            </p>
          </Link>
        </div>
      </div>
    </BlogLayout>
  );
}

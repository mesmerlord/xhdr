import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Instagram,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogLayout } from "@/components/layout/BlogLayout";

const CDN_BASE = "https://images.xhdr.org/public_media";

const POST_DATA = {
  title: "HDR for Instagram & Facebook Ads: The 2025 Advantage",
  description:
    "Instagram now supports HDR photos and videos. Here's how to use HDR to make your ads and content pop on modern displays—and the pitfalls to avoid.",
  date: "2025-12-13",
  readTime: "6 min",
  category: "Marketing",
  image: `${CDN_BASE}/blog-images/hdr-ads-instagram-facebook-hero.jpg`,
};

export default function HDRAdsInstagramFacebook() {
  return (
    <BlogLayout post={POST_DATA}>
      <div className="space-y-12 text-gray-300 text-lg leading-relaxed">
        {/* Intro */}
        <section>
          <p className="text-xl text-gray-400 mb-6">
            Meta added HDR photo support to Instagram and Threads in March 2024.
            As of late 2025, Instagram on iOS also supports Dolby Vision HDR
            video. For advertisers and creators, this means your content can now
            literally glow brighter than competitors who haven&apos;t caught on yet.
          </p>
        </section>

        {/* Video Examples - Instagram Reels Style */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            The Difference in Your Feed
          </h2>
          <p className="text-gray-400 mb-6">
            Here&apos;s how HDR videos compare to standard videos in Instagram Reels.
            On an HDR display, the difference is even more dramatic.
          </p>

          {/* Comparison 1 - Instagram Reels Mockup */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* SDR Version */}
            <div className="relative">
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-2 text-center">Standard SDR</div>
              <div className="bg-black rounded-3xl overflow-hidden relative aspect-[9/16] max-w-[280px] mx-auto shadow-2xl">
                <video
                  src={`${CDN_BASE}/blog-images/hdr-ads-instagram-facebook/hot-take-small.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Instagram Reels UI Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top gradient */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
                  {/* Right side icons */}
                  <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <span className="text-white text-xs mt-1">1.2k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                      <span className="text-white text-xs mt-1">48</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </div>
                  </div>
                  {/* Bottom info */}
                  <div className="absolute bottom-4 left-3 right-14">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-400" />
                      <span className="text-white text-sm font-semibold">creator</span>
                    </div>
                    <p className="text-white text-xs line-clamp-2">Standard video quality #content</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HDR Version */}
            <div className="relative">
              <div className="text-sm text-orange-400 uppercase tracking-wide mb-2 text-center font-medium">HDR Enhanced</div>
              <div className="bg-black rounded-3xl overflow-hidden relative aspect-[9/16] max-w-[280px] mx-auto shadow-2xl ring-2 ring-orange-500/50">
                <video
                  src={`${CDN_BASE}/blog-images/hdr-ads-instagram-facebook/hdr-podcast-small.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Instagram Reels UI Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <span className="text-white text-xs mt-1">8.4k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                      <span className="text-white text-xs mt-1">312</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-3 right-14">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
                      <span className="text-white text-sm font-semibold">creator</span>
                      <span className="text-orange-400 text-xs bg-orange-500/20 px-1.5 py-0.5 rounded">HDR</span>
                    </div>
                    <p className="text-white text-xs line-clamp-2">HDR makes this pop! #hdr #viral</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison 2 - Instagram Reels Mockup */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* SDR Version */}
            <div className="relative">
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-2 text-center">Standard SDR</div>
              <div className="bg-black rounded-3xl overflow-hidden relative aspect-[9/16] max-w-[280px] mx-auto shadow-2xl">
                <video
                  src={`${CDN_BASE}/blog-images/hdr-ads-instagram-facebook/lip-sync-small.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <span className="text-white text-xs mt-1">892</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                      <span className="text-white text-xs mt-1">23</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-3 right-14">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-400" />
                      <span className="text-white text-sm font-semibold">brand</span>
                    </div>
                    <p className="text-white text-xs line-clamp-2">New product launch #ad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HDR Version */}
            <div className="relative">
              <div className="text-sm text-orange-400 uppercase tracking-wide mb-2 text-center font-medium">HDR Enhanced</div>
              <div className="bg-black rounded-3xl overflow-hidden relative aspect-[9/16] max-w-[280px] mx-auto shadow-2xl ring-2 ring-orange-500/50">
                <video
                  src={`${CDN_BASE}/blog-images/hdr-ads-instagram-facebook/not-that-girl-hdr-small.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      <span className="text-white text-xs mt-1">12.1k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                      <span className="text-white text-xs mt-1">847</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-3 right-14">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
                      <span className="text-white text-sm font-semibold">brand</span>
                      <span className="text-orange-400 text-xs bg-orange-500/20 px-1.5 py-0.5 rounded">HDR</span>
                    </div>
                    <p className="text-white text-xs line-clamp-2">HDR ad that converts! #hdr #ad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            View on an HDR display (iPhone, MacBook, HDR monitor) to see the full brightness difference.
          </p>
        </section>

        {/* What Changed */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            What Changed in 2024-2025
          </h2>
          <p className="mb-4">
            Instagram partnered with Google, Samsung, and Apple to roll out HDR
            photo support. Now, when you view HDR content on an HDR-capable
            screen (most modern iPhones, iPads, MacBooks, and flagship
            Androids), the images appear brighter and more vivid than standard
            photos.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              What&apos;s Now Supported
            </h3>
            <ul className="space-y-2">
              <li>
                <strong className="text-white">HDR photos</strong> on Instagram
                and Threads (iOS, Android, web with Chrome)
              </li>
              <li>
                <strong className="text-white">Dolby Vision HDR video</strong>{" "}
                on Instagram iOS (as of late 2025)
              </li>
              <li>
                <strong className="text-white">Facebook Reels</strong> HDR
                support in progress
              </li>
            </ul>
          </div>
          <p>
            The difference on an HDR screen is significant. Photos and videos
            that use HDR appear to have more depth, brighter highlights, and
            richer colors. On a feed full of SDR content, HDR posts pop.
          </p>
        </section>

        {/* Why It Matters for Ads */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Why This Matters for Ads
          </h2>
          <p className="mb-4">
            Attention is everything in social media advertising. When users
            scroll through their feed, you have milliseconds to catch their eye.
            HDR content gives you a literal brightness advantage:
          </p>
          <ul className="space-y-3 my-6">
            <li className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
              <span>
                <strong className="text-white">Brighter product shots.</strong>{" "}
                White backgrounds actually glow. Gold and metallic products
                shimmer.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
              <span>
                <strong className="text-white">Stand out in the feed.</strong>{" "}
                Most advertisers still upload SDR content. HDR ads are literally
                brighter.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
              <span>
                <strong className="text-white">Video ads that pop.</strong> HDR
                video on Instagram Reels makes your content look more
                professional and eye-catching.
              </span>
            </li>
          </ul>
        </section>

        {/* The Caveats */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            The Important Caveats
          </h2>
          <p className="mb-4">
            HDR on Instagram isn&apos;t perfect yet. There are some real
            limitations you need to know:
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 my-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Watch Out For
            </h3>
            <ul className="space-y-3">
              <li>
                <strong className="text-white">
                  Don&apos;t upload HDR from iPhone.
                </strong>
                <span className="text-gray-400 ml-2">
                  Quality is substantially lower. Upload from desktop or Android
                  instead.
                </span>
              </li>
              <li>
                <strong className="text-white">4K not supported.</strong>
                <span className="text-gray-400 ml-2">
                  Instagram can&apos;t process 4K HDR. Stick to 1080p (HD 60fps)
                  for video.
                </span>
              </li>
              <li>
                <strong className="text-white">Processing delays.</strong>
                <span className="text-gray-400 ml-2">
                  HDR content may look normal at first, then appear in HDR after
                  ~30 minutes of processing.
                </span>
              </li>
              <li>
                <strong className="text-white">Bugs with color accuracy.</strong>
                <span className="text-gray-400 ml-2">
                  Some users report colors looking slightly off compared to
                  original.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* How to Upload */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Best Practices for HDR Uploads
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-white">Photos</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Upload from desktop (web) for best quality</li>
                <li>• Android: enable &quot;upload at highest quality&quot; in settings</li>
                <li>• Avoid uploading from iPhone</li>
                <li>• Use gain map HDR format (what cameras produce natively)</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Play className="w-5 h-5 text-pink-400" />
                <h3 className="font-semibold text-white">Videos</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Record in HDR but at HD 60fps (not 4K)</li>
                <li>• Upload directly to Reels or video posts</li>
                <li>• Wait ~30 mins for HDR to process</li>
                <li>• Use native camera app for best HDR capture</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Create HDR Content */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Creating HDR Content for Ads
          </h2>
          <p className="mb-4">
            If you&apos;re shooting content specifically for Instagram ads,
            here&apos;s how to ensure it displays in HDR:
          </p>
          <ol className="space-y-3 my-6 list-decimal list-inside">
            <li>
              <strong className="text-white">Shoot HDR with your phone.</strong>{" "}
              iPhones and flagship Androids shoot HDR by default with their
              native camera apps.
            </li>
            <li>
              <strong className="text-white">
                Edit in HDR-aware software.
              </strong>{" "}
              Photoshop 2025, Affinity Photo, and Pixelmator support HDR
              editing.
            </li>
            <li>
              <strong className="text-white">Export with gain map.</strong> Keep
              the HDR metadata intact when exporting.
            </li>
            <li>
              <strong className="text-white">Upload from desktop.</strong> Use
              Instagram&apos;s web interface or a desktop app for highest quality.
            </li>
          </ol>
          <p>
            For existing content that you want to enhance with HDR, you can add
            HDR gain maps to make standard photos glow on HDR displays.
          </p>
        </section>

        {/* Our Tools */}
        <section className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Add HDR to Your Photos & Videos
          </h3>
          <p className="text-gray-400 mb-6">
            Don&apos;t have HDR source material? Our tools can add HDR gain maps
            to standard photos and convert videos to HDR format—making them pop
            on Instagram, Facebook, and any HDR display.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/tools/hdr"
              className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-5 h-5 text-orange-400" />
                <h4 className="font-medium text-white">Photo HDR</h4>
              </div>
              <p className="text-sm text-gray-400">
                Add HDR gain maps to photos for Instagram, Facebook, and ads
              </p>
            </Link>
            <Link
              href="/tools/hdr-video"
              className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-pink-400" />
                <h4 className="font-medium text-white">Video HDR</h4>
              </div>
              <p className="text-sm text-gray-400">
                Convert videos to HDR for Reels and video ads
              </p>
            </Link>
          </div>
        </section>

        {/* Bottom Line */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">The Bottom Line</h2>
          <p className="mb-4">
            HDR on Instagram is real, it&apos;s live, and most advertisers
            aren&apos;t using it yet. The upload process has quirks, but the
            visual advantage is significant.
          </p>
          <p className="mb-4">
            If you&apos;re running ads on Instagram or Facebook, HDR gives you a
            technical edge: brighter highlights, richer colors, and content that
            literally stands out from the feed.
          </p>
          <p>
            The early adopter window won&apos;t last forever. As more creators
            catch on, HDR will become the norm. Right now, it&apos;s an
            advantage.
          </p>
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
              The basics of HDR for social media
            </p>
          </Link>
          <Link
            href="/blog/twitter-profile-picture-tips"
            className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="font-medium text-white mb-1">
              Profile Pictures That Get Noticed
            </h4>
            <p className="text-sm text-gray-400">
              Research-backed tips for social media photos
            </p>
          </Link>
        </div>
      </div>
    </BlogLayout>
  );
}

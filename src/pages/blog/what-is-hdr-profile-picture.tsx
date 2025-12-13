import Link from "next/link";
import { ArrowRight, Sparkles, Monitor, Smartphone, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogLayout } from "@/components/layout/BlogLayout";

const CDN_BASE = "https://images.xhdr.org/public_media";

const POST_DATA = {
  title: "What is an HDR Profile Picture?",
  description:
    "Ever notice some Twitter profile pictures seem to glow or pop more than others on your iPhone? That's HDR. Here's how it works.",
  date: "2025-12-12",
  readTime: "4 min",
  category: "Explainer",
  image: `${CDN_BASE}/blog-images/what-is-hdr-hero.jpg`,
};

export default function WhatIsHDRProfilePicture() {
  return (
    <BlogLayout post={POST_DATA}>
      <div className="space-y-12 text-gray-300 text-lg leading-relaxed">
        {/* The Effect */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">The Glow Effect</h2>
          <p className="mb-4">
            HDR stands for High Dynamic Range. On an HDR display—like the screen
            on your iPhone, MacBook, iPad, or many newer monitors—images can
            appear brighter than the &quot;normal&quot; maximum brightness.
          </p>
          <p className="mb-4">
            Regular images max out at a certain brightness level. HDR images can
            push past that limit, making certain parts of the image appear to
            literally glow. It&apos;s the same technology that makes sunsets in
            movies look stunning and explosions look blindingly bright.
          </p>
          <p>
            When applied to a profile picture, the effect is subtle but
            noticeable: your avatar appears more vibrant and eye-catching than
            the ones around it.
          </p>
        </section>

        {/* Which Devices */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Which Devices Show the Effect?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 my-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
              <Smartphone className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">iPhone</h3>
              <p className="text-sm text-gray-400">
                iPhone X and newer with OLED/Super Retina displays
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
              <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Mac</h3>
              <p className="text-sm text-gray-400">
                MacBook Pro with Liquid Retina XDR, Pro Display XDR
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
              <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">HDR Monitors</h3>
              <p className="text-sm text-gray-400">
                Any HDR-capable display with HDR enabled
              </p>
            </div>
          </div>
          <p>
            On non-HDR displays, the image looks normal—not broken or weird,
            just like a regular photo. The HDR &quot;boost&quot; only appears
            when viewed on a capable screen.
          </p>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            How It Works (Simply)
          </h2>
          <p className="mb-4">
            Modern HDR images use something called a{" "}
            <strong className="text-white">gain map</strong>. Think of it as a
            second layer hidden inside the image that tells HDR displays:
            &quot;make this part brighter, boost the colors here.&quot;
          </p>
          <p className="mb-4">
            On a regular screen, the base image shows. On an HDR screen, the
            display reads the gain map and increases brightness and color
            intensity in the right spots.
          </p>
          <p>
            This is why HDR profile pictures can appear to glow without looking
            washed out on regular screens—the effect only activates when the
            display supports it.
          </p>
        </section>

        {/* Why It Matters for Profile Pics */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Why It Matters for Profile Pictures
          </h2>
          <p className="mb-4">
            Most people browse Twitter on their phones. Most phones sold in the
            last few years have HDR displays. When everyone else&apos;s profile
            picture looks flat and yours has that extra pop, you stand out.
          </p>
          <p className="mb-4">
            It&apos;s especially noticeable in dark mode, which is what most
            people use. The contrast between the dark background and a glowing
            profile picture is hard to miss.
          </p>
          <p>
            This isn&apos;t about tricking people or using some weird filter.
            It&apos;s using the full capability of modern displays that most
            images don&apos;t take advantage of.
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
                Create Your HDR Profile Picture
              </h3>
              <p className="text-gray-400 mb-4">
                Upload any photo and we&apos;ll add the HDR gain map that makes
                it glow on HDR displays. Takes about 5 seconds.
              </p>
              <Link href="/tools/twitter-hdr">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  Make Your Photo Glow
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Related */}
      <div className="mt-16 pt-8 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">More about HDR</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/blog/hdr-effect-explained"
            className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="font-medium text-white mb-1">
              The HDR Effect: Good vs. Overdone
            </h4>
            <p className="text-sm text-gray-400">
              Why HDR photography has a bad reputation and how to do it right
            </p>
          </Link>
          <Link
            href="/tools/twitter-hdr"
            className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="font-medium text-white mb-1">
              HDR Profile Picture Generator
            </h4>
            <p className="text-sm text-gray-400">
              Create your own glowing profile picture for Twitter/X
            </p>
          </Link>
        </div>
      </div>
    </BlogLayout>
  );
}

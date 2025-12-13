import Link from "next/link";
import { ArrowRight, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogLayout } from "@/components/layout/BlogLayout";

const CDN_BASE = "https://images.xhdr.org/public_media";

const POST_DATA = {
  title: "The HDR Effect: Good vs. Overdone",
  description:
    "HDR photography has a bad reputation. Here's the difference between good HDR and the overly processed look that photographers hate.",
  date: "2025-12-11",
  readTime: "5 min",
  category: "Explainer",
  image: `${CDN_BASE}/blog-images/hdr-effect-hero.jpg`,
};

export default function HDREffectExplained() {
  return (
    <BlogLayout post={POST_DATA}>
      <div className="space-y-12 text-gray-300 text-lg leading-relaxed">
        {/* The Reputation Problem */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Why HDR Gets a Bad Rap
          </h2>
          <p className="mb-4">
            Search &quot;HDR photography&quot; and you&apos;ll find two camps:
            people who love it and people who think it makes photos look fake,
            oversaturated, and cheap.
          </p>
          <p className="mb-4">
            The critics aren&apos;t wrong—bad HDR is everywhere. It&apos;s the
            real estate photos where the sky looks radioactive. It&apos;s the
            landscape shots where every shadow has been eliminated, making the
            scene look flat and lifeless. It&apos;s the portraits where skin
            looks like plastic.
          </p>
          <p>
            But here&apos;s the thing:{" "}
            <strong className="text-white">good HDR is invisible</strong>.
            You&apos;ve seen thousands of well-done HDR images without ever
            noticing them. It&apos;s like CGI in movies—when it&apos;s done
            right, you don&apos;t see it at all.
          </p>
        </section>

        {/* What Actually Goes Wrong */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            What Makes HDR Look Bad
          </h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Common HDR Mistakes
            </h3>
            <ul className="space-y-3">
              <li>
                <strong className="text-white">Killing all contrast.</strong>
                <span className="text-gray-400 ml-2">
                  Shadows and highlights give photos depth. Remove them all and
                  everything looks flat.
                </span>
              </li>
              <li>
                <strong className="text-white">Halos around edges.</strong>
                <span className="text-gray-400 ml-2">
                  Those bright outlines around rooflines and trees? That&apos;s
                  the software trying too hard.
                </span>
              </li>
              <li>
                <strong className="text-white">Oversaturation.</strong>
                <span className="text-gray-400 ml-2">
                  Pushing colors past reality into cartoon territory.
                </span>
              </li>
              <li>
                <strong className="text-white">
                  Using HDR when you don&apos;t need it.
                </strong>
                <span className="text-gray-400 ml-2">
                  If the scene fits in your camera&apos;s dynamic range already,
                  HDR just flattens it.
                </span>
              </li>
            </ul>
          </div>
          <p>
            The core issue: HDR is a technical tool that got marketed as a
            style. It&apos;s meant to capture scenes your camera can&apos;t
            handle naturally—not to make normal photos look &quot;more
            dramatic.&quot;
          </p>
        </section>

        {/* Two Types of HDR */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Two Different Things Called &quot;HDR&quot;
          </h2>
          <p className="mb-4">
            This is where it gets confusing. There are actually two completely
            different things both called HDR:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2">
                Old HDR (Tone Mapping)
              </h3>
              <p className="text-gray-400 text-sm">
                Combining multiple exposures and compressing them into a single
                image that any screen can display. This is where the &quot;HDR
                look&quot; comes from—and where things often go wrong.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2">
                New HDR (Display HDR)
              </h3>
              <p className="text-gray-400 text-sm">
                Images that use the extended brightness range of modern HDR
                displays. No fake processing—just showing colors and brightness
                that old screens couldn&apos;t handle.
              </p>
            </div>
          </div>

          <p>
            Display HDR—what your iPhone and MacBook can show—is different.
            It&apos;s not about processing a photo to look surreal. It&apos;s
            about displaying the actual brightness and colors that were there in
            the original scene.
          </p>
        </section>

        {/* When HDR Works */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            When HDR Actually Works
          </h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Good Uses for HDR
            </h3>
            <ul className="space-y-3">
              <li>
                <strong className="text-white">High-contrast scenes.</strong>
                <span className="text-gray-400 ml-2">
                  Bright sky + dark foreground, interiors with windows, backlit
                  subjects.
                </span>
              </li>
              <li>
                <strong className="text-white">Preserving detail.</strong>
                <span className="text-gray-400 ml-2">
                  When you&apos;d otherwise have to choose between blown
                  highlights or crushed shadows.
                </span>
              </li>
              <li>
                <strong className="text-white">
                  Display HDR on profile pictures.
                </strong>
                <span className="text-gray-400 ml-2">
                  Adding brightness that makes your avatar pop on HDR screens
                  without looking processed.
                </span>
              </li>
            </ul>
          </div>
          <p>
            The key is subtlety. The best HDR processing is the kind you
            don&apos;t notice—it just makes the photo look like what your eyes
            actually saw.
          </p>
        </section>

        {/* Profile Pics Specifically */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            HDR for Profile Pictures
          </h2>
          <p className="mb-4">
            For profile pictures specifically, we&apos;re not talking about the
            heavy tone-mapping that gives HDR its bad name. We&apos;re talking
            about display HDR: adding a gain map that tells HDR screens to boost
            the brightness in certain areas.
          </p>
          <p className="mb-4">
            The result looks normal on regular screens but appears to glow on
            iPhones, MacBooks, and HDR monitors. No halos. No oversaturation.
            Just brighter, more vibrant colors that use what modern displays are
            actually capable of.
          </p>
          <p>
            It&apos;s the difference between making a photo <em>look</em> like
            HDR (often badly) and making a photo that <em>uses</em> HDR displays
            to their full potential.
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
                Try the Subtle Approach
              </h3>
              <p className="text-gray-400 mb-4">
                Our HDR generator adds display HDR to your profile picture—the
                kind that glows on modern screens without looking processed.
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
            href="/tools/twitter-hdr"
            className="block p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-colors"
          >
            <h4 className="font-medium text-white mb-1">
              HDR Profile Picture Generator
            </h4>
            <p className="text-sm text-gray-400">Make your own glowing avatar</p>
          </Link>
        </div>
      </div>
    </BlogLayout>
  );
}

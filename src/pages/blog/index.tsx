import Link from "next/link";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { HDRNavbar } from "@/components/HDRNavbar";
import Seo from "@/components/Seo";
import { BLOG_POSTS } from "@/lib/blogData";
import { Button } from "@/components/ui/button";

export default function BlogIndex() {
  const featuredPosts = BLOG_POSTS.filter((post) => post.featured);
  const otherPosts = BLOG_POSTS.filter((post) => !post.featured);

  return (
    <>
      <Seo
        title="XHDR Blog - HDR Photography Tips & Guides"
        description="Learn about HDR profile pictures, how to make your Twitter photos stand out, and tips for creating eye-catching content on social media."
      />

      <HDRNavbar />

      <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              XHDR Blog
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tips, guides, and insights on HDR photography for social media.
              Learn how to make your photos pop on modern displays.
            </p>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold text-white mb-6">Featured</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300">
                      {post.image && (
                        <div className="relative overflow-hidden aspect-[16/9] bg-gray-700">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-orange-500/90 text-white rounded-full">
                              {post.category}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          <span className="mx-2">·</span>
                          <Clock className="w-4 h-4 mr-2" />
                          {post.readTime}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center text-orange-400 font-medium mt-4 text-sm group-hover:text-orange-300">
                          Read article
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold text-white mb-6">More Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300">
                      {post.image && (
                        <div className="relative overflow-hidden aspect-[16/9] bg-gray-700">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          <span className="mx-2">·</span>
                          {post.readTime}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-2xl p-8 md:p-12 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Make Your Profile Glow?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Create an HDR profile picture that stands out on Twitter/X.
                Works on iPhone, Mac, iPad, and HDR displays.
              </p>
              <Link href="/tools/twitter-hdr">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-xl">
                  Create HDR Profile Picture
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

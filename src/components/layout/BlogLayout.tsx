import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Footer } from "@/components/Footer";
import { HDRNavbar } from "@/components/HDRNavbar";
import Seo from "@/components/Seo";

interface BlogPost {
  title: string;
  description: string;
  date: string;
  readTime: string;
  category?: string;
  image?: string;
}

interface BlogLayoutProps {
  post: BlogPost;
  children: ReactNode;
}

export function BlogLayout({ post, children }: BlogLayoutProps) {
  return (
    <>
      <Seo
        title={`${post.title} | XHDR`}
        description={post.description}
        image={post.image}
        openGraph={{
          type: "article",
          images: post.image
            ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
            : undefined,
        }}
        twitter={{
          card: "summary_large_image",
          title: post.title,
          description: post.description,
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          publisher: {
            "@type": "Organization",
            name: "XHDR",
          },
        }}
      />

      <HDRNavbar />

      <main className="pt-20 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Hero Section */}
        <div className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </div>

            <div className="max-w-3xl">
              {post.category && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                    {post.category}
                  </span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                {post.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime} read
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {post.image && (
          <div className="max-w-5xl mx-auto px-4 mb-12">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 pb-16">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-orange-400 prose-strong:text-white">
            {children}
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}

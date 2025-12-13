const CDN_BASE = "https://images.xhdr.org/public_media";

export const BLOG_POSTS = [
  {
    slug: "hdr-ads-instagram-facebook",
    title: "HDR for Instagram & Facebook Ads: The 2025 Advantage",
    description:
      "Instagram now supports HDR photos and videos. Here's how to use HDR to make your ads and content pop on modern displays—and the pitfalls to avoid.",
    date: "2025-12-13",
    readTime: "6 min",
    category: "Marketing",
    image: `${CDN_BASE}/blog-images/hdr-ads-instagram-facebook-hero.jpg`,
    featured: true,
  },
  {
    slug: "twitter-profile-picture-tips",
    title: "Twitter Profile Pictures That Get Noticed",
    description:
      "Research-backed tips for X/Twitter profile pictures that get noticed. From color psychology to the technical specs that prevent blurry avatars.",
    date: "2025-12-13",
    readTime: "5 min",
    category: "Tips",
    image: `${CDN_BASE}/blog-images/profile-picture-tips-hero.jpg`,
    featured: true,
  },
  {
    slug: "what-is-hdr-profile-picture",
    title: "What is an HDR Profile Picture?",
    description:
      "Ever notice some Twitter profile pictures seem to glow or pop more than others on your iPhone? That's HDR. Here's how it works.",
    date: "2025-12-12",
    readTime: "4 min",
    category: "Explainer",
    image: `${CDN_BASE}/blog-images/what-is-hdr-hero.jpg`,
    featured: true,
  },
  {
    slug: "hdr-effect-explained",
    title: "The HDR Effect: Good vs. Overdone",
    description:
      "HDR photography has a bad reputation. Here's the difference between good HDR and the overly processed look that photographers hate.",
    date: "2025-12-11",
    readTime: "5 min",
    category: "Explainer",
    image: `${CDN_BASE}/blog-images/hdr-effect-hero.jpg`,
    featured: false,
  },
];

export type BlogPost = (typeof BLOG_POSTS)[0];

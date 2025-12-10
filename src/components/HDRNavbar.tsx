import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

export function HDRNavbar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          X<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">HDR</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/tools/twitter-hdr"
            className={cn(
              "transition-colors",
              currentPath === "/tools/twitter-hdr"
                ? "text-orange-400 font-medium"
                : "text-gray-400 hover:text-orange-400"
            )}
          >
            Profile Picture
          </Link>
          <Link
            href="/tools/hdr"
            className={cn(
              "transition-colors",
              currentPath === "/tools/hdr"
                ? "text-blue-400 font-medium"
                : "text-gray-400 hover:text-blue-400"
            )}
          >
            Photos & Posts
          </Link>
        </nav>
      </div>
    </header>
  );
}

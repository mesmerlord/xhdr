import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Menu, X, Image, User, Video } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  {
    href: "/tools/twitter-hdr",
    label: "Profile Picture",
    activeColor: "text-orange-400",
    hoverColor: "hover:text-orange-400",
    icon: User,
    bgColor: "from-orange-500 to-pink-500",
  },
  {
    href: "/tools/hdr",
    label: "Photos",
    activeColor: "text-blue-400",
    hoverColor: "hover:text-blue-400",
    icon: Image,
    bgColor: "from-blue-500 to-purple-500",
  },
  {
    href: "/tools/hdr-video",
    label: "Videos",
    activeColor: "text-purple-400",
    hoverColor: "hover:text-purple-400",
    icon: Video,
    bgColor: "from-purple-500 to-pink-500",
  },
];

export function HDRNavbar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          X<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">HDR</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors",
                currentPath === item.href
                  ? `${item.activeColor} font-medium`
                  : `text-gray-400 ${item.hoverColor}`
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] p-0 bg-gray-900 border-l border-white/10"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <Link
                    href="/"
                    className="text-2xl font-bold text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    X<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">HDR</span>
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">HDR Tools for Social Media</p>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-4 space-y-2">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl transition-all",
                          isActive
                            ? "bg-white/10"
                            : "hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                          item.bgColor
                        )}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className={cn(
                            "font-medium",
                            isActive ? item.activeColor : "text-white"
                          )}>
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.label === "Profile Picture" && "400x400 HDR avatar"}
                            {item.label === "Photos" && "Full size HDR photos"}
                            {item.label === "Videos" && "HDR video conversion"}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

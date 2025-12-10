import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";
import {
  CreditCard,
  ImageIcon,
  Sparkles,
  ArrowRight,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { routes } from "@/lib/constants";
import { trpc } from "@/utils/trpc";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: userData, isLoading } = trpc.user.me.useQuery(undefined, {
    enabled: !!session,
  });

  const { data: recentAds } = trpc.adGeneration.getRecent.useQuery(
    { limit: 6 },
    { enabled: !!session }
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(routes.auth.login);
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Seo title="Dashboard - AdMake AI" noIndex />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            AdMake<span className="text-orange-500">AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={routes.tools.adGenerator}
              className="text-gray-600 hover:text-gray-900"
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
            <span className="text-sm text-gray-600">{session.user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user?.name?.split(" ")[0] || "there"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to create some amazing ads?
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Credits Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <CreditCard className="w-8 h-8 text-orange-500" />
                  {userData?.subscriptionStatus === "active" && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Crown className="w-3 h-3 inline mr-1" />
                      Pro
                    </span>
                  )}
                </div>
                <p className="text-4xl font-bold text-gray-900">
                  {userData?.credits ?? 0}
                </p>
                <p className="text-gray-600 text-sm">Credits remaining</p>
                {(userData?.credits ?? 0) < 10 && (
                  <Link href={routes.common.pricing}>
                    <Button
                      size="sm"
                      className="mt-4 bg-orange-500 hover:bg-orange-600"
                    >
                      Get More Credits
                    </Button>
                  </Link>
                )}
              </div>

              {/* Ads Created Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <ImageIcon className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-4xl font-bold text-gray-900">
                  {recentAds?.length ?? 0}
                </p>
                <p className="text-gray-600 text-sm">Ads created</p>
              </div>

              {/* Plan Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Sparkles className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-4xl font-bold text-gray-900 capitalize">
                  {userData?.subscriptionStatus === "active"
                    ? userData?.subscriptionPlan || "Pro"
                    : "Free"}
                </p>
                <p className="text-gray-600 text-sm">Current plan</p>
                {userData?.subscriptionStatus !== "active" && (
                  <Link href={routes.common.pricing}>
                    <Button size="sm" variant="outline" className="mt-4">
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    Create Your Next Ad
                  </h2>
                  <p className="text-white/80">
                    Generate stunning AI-powered advertisements in seconds
                  </p>
                </div>
                <Link href={routes.tools.adGenerator}>
                  <Button
                    size="lg"
                    className="bg-white text-orange-500 hover:bg-orange-50"
                  >
                    Start Creating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Ads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Ads</h2>
                {recentAds && recentAds.length > 0 && (
                  <Link
                    href={routes.tools.adGenerator}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    View All
                  </Link>
                )}
              </div>

              {recentAds && recentAds.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {recentAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      {ad.imageUrls[0] && (
                        <img
                          src={ad.imageUrls[0]}
                          alt="Generated ad"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No ads created yet</p>
                  <Link href={routes.tools.adGenerator}>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Create Your First Ad
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

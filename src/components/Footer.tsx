import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              X<span className="text-orange-500">HDR</span>
            </h2>
            <p className="text-gray-400 max-w-md">
              Create HDR images that pop on Twitter/X. Make your profile picture
              stand out with vibrant colors on HDR displays.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
              Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tools/twitter-hdr"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Profile Picture HDR
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/hdr"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Photo HDR
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/hdr-video"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Video HDR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <span className="text-sm text-gray-400">
              © {currentYear} XHdr. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

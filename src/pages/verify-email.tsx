import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { routes } from "@/lib/constants";
import { trpc } from "@/utils/trpc";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const verifyMutation = trpc.user.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus("success");
      setMessage("Your email has been verified successfully!");
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Failed to verify email. The link may have expired.");
    },
  });

  useEffect(() => {
    if (token && typeof token === "string") {
      verifyMutation.mutate({ token });
    }
  }, [token]);

  return (
    <>
      <Seo title="Verify Email - AdMake AI" noIndex />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AdMake<span className="text-orange-500">AI</span>
            </h1>
          </Link>

          <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
            <div className="text-center">
              {status === "loading" && (
                <>
                  <Loader2 className="w-16 h-16 mx-auto text-orange-500 animate-spin mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Verifying your email...
                  </h2>
                  <p className="text-gray-600">Please wait a moment.</p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Email Verified!
                  </h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <Link href={routes.auth.login}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Continue to Login
                    </Button>
                  </Link>
                </>
              )}

              {status === "error" && (
                <>
                  <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Verification Failed
                  </h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <div className="space-y-3">
                    <Link href={routes.auth.register}>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        Try Again
                      </Button>
                    </Link>
                    <Link href={routes.auth.login}>
                      <Button variant="outline" className="w-full">
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { Footer } from "@/components/Footer";
import { routes } from "@/lib/constants";
import { planList } from "@/constants/pricing";

export default function PricingPage() {
  return (
    <>
      <Seo
        title="Pricing - AdMake AI"
        description="Simple, transparent pricing for AI-powered ad generation. Start free with 25 credits, upgrade when you need more."
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            AdMake<span className="text-orange-500">AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href={routes.tools.adGenerator} className="text-gray-600 hover:text-gray-900">
              Tools
            </Link>
            <Link href={routes.common.pricing} className="text-orange-500 font-medium">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href={routes.auth.login}>
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href={routes.auth.register}>
              <Button className="bg-orange-500 hover:bg-orange-600">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free with 25 credits. Upgrade when you need more. No hidden fees.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {planList.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-8 ${
                    plan.popular
                      ? "bg-orange-500 text-white ring-4 ring-orange-200 scale-105"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="text-sm font-medium mb-4 inline-block bg-white/20 px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3
                    className={`text-2xl font-bold ${
                      plan.popular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.plan_name}
                  </h3>
                  <p
                    className={`mt-2 text-sm ${
                      plan.popular ? "text-orange-100" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    <span
                      className={`text-5xl font-bold ${
                        plan.popular ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${plan.price.monthly}
                    </span>
                    <span
                      className={plan.popular ? "text-orange-100" : "text-gray-500"}
                    >
                      /month
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      plan.popular ? "text-orange-100" : "text-gray-500"
                    }`}
                  >
                    or ${Math.round(plan.price.yearly / 12)}/mo billed yearly (save{" "}
                    {plan.price.yearlyDiscount}%)
                  </p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            feature.available
                              ? plan.popular
                                ? "text-white"
                                : "text-orange-500"
                              : "text-gray-300"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            feature.available
                              ? plan.popular
                                ? "text-white"
                                : "text-gray-700"
                              : "text-gray-400 line-through"
                          }`}
                        >
                          {feature.values
                            ? feature.feature.replace(
                                /\{\{(\w+)\}\}/g,
                                (_, key) => feature.values?.[key]?.toString() || ""
                              )
                            : feature.feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href={routes.auth.register}>
                    <Button
                      className={`w-full mt-8 ${
                        plan.popular
                          ? "bg-white text-orange-500 hover:bg-orange-50"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "What are credits?",
                  a: "Credits are used to generate ad images. Each ad generation typically costs 2-10 credits depending on the quality and complexity.",
                },
                {
                  q: "Do unused credits roll over?",
                  a: "Yes! Unused credits roll over to the next month as long as your subscription is active.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes! All new users get 25 free credits to try out the platform. No credit card required.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Create Amazing Ads?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start with 25 free credits. No credit card required.
            </p>
            <Link href={routes.auth.register}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

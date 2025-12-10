type Feature = {
  feature: string;
  available: boolean;
  values?: Record<string, number>;
};

export type PlanPrice = {
  monthly: number;
  yearly: number;
  yearlyDiscount: number;
};

export type Plan = {
  plan: string;
  plan_name: string;
  price: PlanPrice;
  popular: boolean;
  features: Feature[];
  monthlyPriceId: string;
  yearlyPriceId: string;
  id: string;
  credits_per_month: number;
  description: string;
};

const baseFeatures = [
  { feature: "Commercial usage", available: true },
  { feature: "All AI Ad Templates", available: true },
];

export const planList: Plan[] = [
  {
    plan: "starter",
    plan_name: "Starter",
    credits_per_month: 500,
    description: "For individuals and small businesses getting started",
    price: {
      monthly: 39,
      yearly: 280.8,
      yearlyDiscount: 40,
    },
    popular: false,
    features: [
      {
        feature: "{{credits}} ad credits/month",
        values: { credits: 500 },
        available: true,
      },
      ...baseFeatures,
      { feature: "Standard quality ads", available: true },
      { feature: "Basic templates", available: true },
      { feature: "Email support", available: true },
      { feature: "Priority processing", available: false },
      { feature: "Custom branding", available: false },
    ],
    monthlyPriceId: "price_starter_monthly",
    yearlyPriceId: "price_starter_yearly",
    id: "starter",
  },
  {
    plan: "professional",
    plan_name: "Professional",
    credits_per_month: 1500,
    description: "For growing businesses with higher ad volume",
    price: {
      monthly: 79,
      yearly: 568.8,
      yearlyDiscount: 40,
    },
    popular: true,
    features: [
      {
        feature: "{{credits}} ad credits/month",
        values: { credits: 1500 },
        available: true,
      },
      ...baseFeatures,
      { feature: "High quality ads", available: true },
      { feature: "Premium templates", available: true },
      { feature: "Priority email support", available: true },
      { feature: "Priority processing", available: true },
      { feature: "Custom branding", available: false },
    ],
    monthlyPriceId: "price_professional_monthly",
    yearlyPriceId: "price_professional_yearly",
    id: "professional",
  },
  {
    plan: "business",
    plan_name: "Business",
    credits_per_month: 4000,
    description: "For agencies and enterprises with high volume needs",
    price: {
      monthly: 139,
      yearly: 1000.8,
      yearlyDiscount: 40,
    },
    popular: false,
    features: [
      {
        feature: "{{credits}} ad credits/month",
        values: { credits: 4000 },
        available: true,
      },
      ...baseFeatures,
      { feature: "Ultra quality ads", available: true },
      { feature: "All templates", available: true },
      { feature: "Priority support", available: true },
      { feature: "Priority processing", available: true },
      { feature: "Custom branding", available: true },
    ],
    monthlyPriceId: "price_business_monthly",
    yearlyPriceId: "price_business_yearly",
    id: "business",
  },
];

export const FREE_CREDITS = 25;

export const CREDITS_COST = {
  AD_GENERATION: 2,
  AD_GENERATION_HIGH_QUALITY: 5,
  AD_GENERATION_ULTRA: 10,
};

import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "@/features/auth";

export type OnboardingDraft = {
  businessName: string;
  businessDescription: string;
  category: string;
  fullName: string;
  phone: string;
  gender: string;
  dob: string;
  location: string;
  language: string;
  currency: string;
  startDate: string;
};

const Ctx = createContext<{
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
}>({
  draft: {
    businessName: "", businessDescription: "", category: "Retail & Provision",
    fullName: "", phone: "", gender: "", dob: "",
    location: "", language: "English", currency: "Nigerian Naira (₦)", startDate: "",
  },
  update: () => {},
});

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [draft, setDraft] = useState<OnboardingDraft>({
    businessName: "",
    businessDescription: "",
    category: "Retail & Provision",
    // The name typed at sign-up is stored with the account, so pre-fill it
    fullName: (session?.user.user_metadata?.full_name as string | undefined) ?? "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    language: "English",
    currency: "Nigerian Naira (₦)",
    startDate: "",
  });

  const update = (patch: Partial<OnboardingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  return <Ctx.Provider value={{ draft, update }}>{children}</Ctx.Provider>;
}

export const useOnboardingDraft = () => useContext(Ctx);
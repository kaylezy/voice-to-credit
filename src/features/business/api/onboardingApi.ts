import { apiFetch, type ApiResult } from "@/lib/api";
import type { OnboardingDraft } from "../hooks/useOnboardingDraft";

// "12/03/1986" or "1986-03-12" -> "1986-03-12". Empty -> null. Invalid -> undefined.
function toIsoDate(input: string): string | null | undefined {
  const v = input.trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!m) return undefined;
  const [, d, mo, y] = m;
  const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  const dt = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(dt.getTime()) || dt.getUTCDate() !== Number(d)) return undefined;
  return iso;
}

const LANGUAGES: Record<string, string> = {
  english: "en", yoruba: "yo", hausa: "ha", igbo: "ig", pidgin: "pcm",
};
const toLanguageCode = (v: string) => LANGUAGES[v.trim().toLowerCase()] ?? "en";

function toCurrencyCode(v: string) {
  const s = v.toLowerCase();
  if (s.includes("usd") || s.includes("dollar") || s.includes("$")) return "USD";
  if (s.includes("gbp") || s.includes("pound") || s.includes("£")) return "GBP";
  if (s.includes("eur") || s.includes("euro") || s.includes("€")) return "EUR";
  return "NGN";
}

const FIELD_LABELS: Record<string, string> = {
  full_name: "Full name",
  phone: "Phone number",
  gender: "Gender",
  date_of_birth: "Date of birth",
  name: "Business name",
  description: "Description",
  category: "Category",
  location: "Location",
};

function describe(res: Extract<ApiResult<unknown>, { ok: false }>): string {
  if (res.error === "network_error") {
    return "Can't reach the server. Check your connection and try again.";
  }
  if (res.error === "validation_failed" && res.fields) {
    const first = Object.entries(res.fields)[0];
    if (first) return `${FIELD_LABELS[first[0]] ?? first[0]}: ${first[1][0]}`;
  }
  return "Something went wrong. Please try again.";
}

export async function submitOnboarding(
  draft: OnboardingDraft
): Promise<{ ok: true } | { ok: false; message: string }> {
  const dob = toIsoDate(draft.dob);
  if (dob === undefined) {
    return { ok: false, message: "Date of birth must look like 12/03/1986." };
  }

  // 1) Profile first. If it already exists (a retry), carry on.
  const profile = await apiFetch("/api/profiles", {
    method: "POST",
    body: {
      full_name: draft.fullName.trim(),
      ...(draft.phone.trim() ? { phone: draft.phone.trim() } : {}),
      ...(draft.gender.trim() ? { gender: draft.gender.trim() } : {}),
      ...(dob ? { date_of_birth: dob } : {}),
    },
  });
  if (!profile.ok && profile.error !== "profile_already_exists") {
    return { ok: false, message: describe(profile) };
  }

  // 2) Business last, because having a business is what ends onboarding.
  const business = await apiFetch("/api/businesses", {
    method: "POST",
    body: {
      name: draft.businessName.trim(),
      ...(draft.businessDescription.trim() ? { description: draft.businessDescription.trim() } : {}),
      category: draft.category,
      ...(draft.location.trim() ? { location: draft.location.trim() } : {}),
      language: toLanguageCode(draft.language),
      currency: toCurrencyCode(draft.currency),
    },
  });
  if (!business.ok && business.error !== "business_already_exists") {
    return { ok: false, message: describe(business) };
  }

  return { ok: true };
}
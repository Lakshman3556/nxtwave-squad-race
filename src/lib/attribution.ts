"use client";

const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

export function captureAndPersistAttribution(): {
  refCode: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
} {
  if (typeof window === "undefined") {
    return { refCode: null, utmSource: null, utmMedium: null, utmCampaign: null };
  }

  const params = new URLSearchParams(window.location.search);
  const refParam = params.get("ref");
  const sourceParam = params.get("utm_source");
  const mediumParam = params.get("utm_medium");
  const campaignParam = params.get("utm_campaign");

  // If new ref found in URL, save to cookie + sessionStorage
  if (refParam) {
    const cleanRef = refParam.trim().toUpperCase();
    sessionStorage.setItem("squad_ref_code", cleanRef);
    setCookie("squad_ref_code", cleanRef, COOKIE_DAYS);
  }

  if (sourceParam) {
    sessionStorage.setItem("squad_utm_source", sourceParam);
    setCookie("squad_utm_source", sourceParam, COOKIE_DAYS);
  }
  if (mediumParam) {
    sessionStorage.setItem("squad_utm_medium", mediumParam);
    setCookie("squad_utm_medium", mediumParam, COOKIE_DAYS);
  }
  if (campaignParam) {
    sessionStorage.setItem("squad_utm_campaign", campaignParam);
    setCookie("squad_utm_campaign", campaignParam, COOKIE_DAYS);
  }

  const resolvedRef =
    refParam ||
    sessionStorage.getItem("squad_ref_code") ||
    getCookie("squad_ref_code");

  const resolvedSource =
    sourceParam ||
    sessionStorage.getItem("squad_utm_source") ||
    getCookie("squad_utm_source");

  const resolvedMedium =
    mediumParam ||
    sessionStorage.getItem("squad_utm_medium") ||
    getCookie("squad_utm_medium");

  const resolvedCampaign =
    campaignParam ||
    sessionStorage.getItem("squad_utm_campaign") ||
    getCookie("squad_utm_campaign");

  return {
    refCode: resolvedRef || null,
    utmSource: resolvedSource || null,
    utmMedium: resolvedMedium || null,
    utmCampaign: resolvedCampaign || null,
  };
}

export function trackEvent(
  type: "view" | "form_start" | "submit" | "share_click" | "copy_link" | "wa_click",
  refCode?: string | null,
  source?: string | null
) {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        ref_code: refCode || undefined,
        source: source || undefined,
        session_id: sessionStorage.getItem("squad_session_id") || "sess_" + Math.random().toString(36).slice(2, 9),
      }),
    }).catch(() => {});
  } catch {
    // Fail-safe analytics: never block user flow
  }
}

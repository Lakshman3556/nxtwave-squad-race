export type RegistrationStatus = "provisional" | "verified" | "void";

export type EventType =
  | "view"
  | "form_start"
  | "submit"
  | "share_click"
  | "copy_link"
  | "wa_click";

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  name_norm: string;
}

export interface Registration {
  id: string;
  created_at: string;
  name: string;
  email_lower: string;
  college_id: string;
  college_other?: string | null;
  college_name?: string; // Resolved helper name
  branch: string;
  grad_year: string; // "2027" | "Other"
  referral_code: string; // 6 chars (ABCDEFGHJKMNPQRSTUVWXYZ23456789)
  referred_by_code?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  ip_hash: string;
  status: RegistrationStatus;
  void_reason?: string | null;
  consent: boolean;
  is_demo: boolean;
}

export interface AnalyticsEvent {
  id: string;
  created_at: string;
  session_id: string;
  type: EventType;
  registration_id?: string | null;
  source?: string | null;
  ref_code?: string | null;
  is_demo: boolean;
}

export interface CollegeLeaderboardItem {
  college_id: string;
  college_name: string;
  city: string;
  state: string;
  count: number;
  rank: number;
}

export interface IndividualLeaderboardItem {
  first_name: string;
  college_name: string;
  referrals_count: number;
  rank: number;
  referral_code: string;
}

export interface GrowthDashboardData {
  is_demo: boolean;
  total_registrations: number;
  target_registrations: number;
  verified_registrations: number;
  void_registrations: number;
  unique_colleges: number;
  daily_counts: Array<{
    day: number;
    date: string;
    actual: number;
    cumulative_actual: number;
    target: number;
    cumulative_target: number;
  }>;
  source_breakdown: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  top_colleges: CollegeLeaderboardItem[];
  funnel: {
    views: number;
    form_starts: number;
    registrations: number;
    shares: number;
    conversion_rate: number;
    share_rate: number;
  };
  k_factor: {
    observed_k: number;
    share_rate: number;
    referrals_per_sharer: number;
    viral_coefficient: number;
    projection_status: string;
  };
}

export interface RegistrationInput {
  name: string;
  email: string;
  college_id: string;
  college_other?: string;
  branch: string;
  grad_year: string;
  consent: boolean;
  ref_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export const FORM_HONEYPOT_FIELD = "website";
export const FORM_STARTED_AT_FIELD = "startedAt";

type HumanCheckInput = {
  honeypot?: string | null;
  startedAt?: string | number | null;
};

type GuardOptions = {
  formKey: string;
  email?: string | null;
  windowMinutes?: number;
  maxFingerprintAttempts?: number;
  maxEmailAttempts?: number;
};

type GuardResult = {
  allowed: boolean;
  reason?: string;
  setupMissing?: boolean;
};

export function validateHumanSubmission({
  honeypot,
  startedAt
}: HumanCheckInput): GuardResult {
  if (honeypot?.trim()) {
    return {
      allowed: false,
      reason: "We could not submit that form. Please try again."
    };
  }

  if (!startedAt) {
    return { allowed: true };
  }

  const parsed =
    typeof startedAt === "number" ? startedAt : Number.parseInt(String(startedAt), 10);

  if (!Number.isFinite(parsed)) {
    return { allowed: true };
  }

  if (Date.now() - parsed < 1200) {
    return {
      allowed: false,
      reason: "Please wait a moment and try again."
    };
  }

  return { allowed: true };
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

async function buildFingerprint(request: Request) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  return createHash("sha256").update(`${ip}:${userAgent}`).digest("hex");
}

function isGuardSetupError(error: { message?: string; details?: string } | null) {
  const detail = `${error?.message ?? ""} ${error?.details ?? ""}`;
  return detail.includes("guard_public_form_submission") || detail.includes("form_submission_guards");
}

export async function guardPublicFormSubmission(
  supabase: SupabaseClient,
  request: Request,
  {
    formKey,
    email,
    windowMinutes = 15,
    maxFingerprintAttempts = 8,
    maxEmailAttempts = 4
  }: GuardOptions
): Promise<GuardResult> {
  const fingerprint = await buildFingerprint(request);

  const { data, error } = await supabase.rpc("guard_public_form_submission", {
    p_form_key: formKey,
    p_fingerprint: fingerprint,
    p_email: email?.trim().toLowerCase() || null,
    p_window_minutes: windowMinutes,
    p_max_fingerprint_attempts: maxFingerprintAttempts,
    p_max_email_attempts: maxEmailAttempts
  });

  if (error) {
    if (isGuardSetupError(error)) {
      return { allowed: true, setupMissing: true };
    }

    return {
      allowed: false,
      reason: "We could not submit that form right now. Please try again."
    };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    allowed: Boolean(row?.allowed),
    reason: row?.reason ?? undefined
  };
}

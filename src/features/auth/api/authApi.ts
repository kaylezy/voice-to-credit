import type { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { AuthResult, SignUpInput } from "../types/types";

// Turns Supabase's error codes into messages a user can understand
function friendly(error: AuthError): { code: string; message: string } {
  const code = error.code ?? "unknown";
  const messages: Record<string, string> = {
    invalid_credentials: "Wrong email or password.",
    email_not_confirmed: "Please verify your email first.",
    user_already_exists: "An account with this email already exists. Try logging in.",
    otp_expired: "That code is wrong or has expired. Request a new one.",
    over_email_send_rate_limit: "Too many emails sent. Please wait a few minutes and try again.",
    over_request_rate_limit: "Too many attempts. Please wait a moment and try again.",
    weak_password: "Password is too weak. Use upper and lower case letters, numbers and a symbol.",
    same_password: "Choose a password you haven't used before.",
  };
  return { code, message: messages[code] ?? "Something went wrong. Please try again." };
}

const fail = (error: AuthError): { ok: false; code: string; message: string } => ({
  ok: false,
  ...friendly(error),
});

export async function signUp({ fullName, email, password }: SignUpInput): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { full_name: fullName.trim() } },
  });
  if (error) return fail(error);

  // Supabase hides whether an email is already registered: it returns success
  // with no identities and sends no code.
  if (data.user && data.user.identities?.length === 0) {
    return { ok: false, code: "user_already_exists", message: friendly({ code: "user_already_exists" } as AuthError).message };
  }
  return { ok: true, data: undefined };
}

export async function verifySignupCode(email: string, code: string): Promise<AuthResult> {
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: code.trim(),
    type: "signup",
  });
  return error ? fail(error) : { ok: true, data: undefined };
}

export async function resendSignupCode(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim().toLowerCase(),
  });
  return error ? fail(error) : { ok: true, data: undefined };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  return error ? fail(error) : { ok: true, data: undefined };
}

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  return error ? fail(error) : { ok: true, data: undefined };
}

// Forgot password: 1) request code  2) verify code (this logs the user in)  3) set new password
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
  return error ? fail(error) : { ok: true, data: undefined };
}

export async function verifyResetCode(email: string, code: string): Promise<AuthResult> {
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: code.trim(),
    type: "recovery",
  });
  return error ? fail(error) : { ok: true, data: undefined };
}

export async function setNewPassword(password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password });
  return error ? fail(error) : { ok: true, data: undefined };
}
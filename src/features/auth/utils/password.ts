// Returns a message if the password is not acceptable, or null if it is fine.
// Keep MIN_LENGTH in step with Supabase (Authentication > Sign In / Providers > Email).
const MIN_LENGTH = 8;

export function checkPassword(password: string): string | null {
  if (password.length < MIN_LENGTH) return `Password must be at least ${MIN_LENGTH} characters.`;
  if (!/[a-z]/.test(password)) return "Password needs a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password needs an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password needs a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password needs a symbol, for example ! or @.";
  return null;
}
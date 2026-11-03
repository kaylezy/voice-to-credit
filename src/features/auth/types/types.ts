export type AuthResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

export type SignUpInput = {
  fullName: string;
  email: string;
  password: string;
};
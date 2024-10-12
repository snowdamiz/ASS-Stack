import { type SqliteError } from "@/models/types"

export function validateEmail(email: string) {
  return email.length > 3 && email.length < 36
}
export function validatePassword(password: string) {
  return password.length > 6 && password.length < 255
}
export function isSqliteError(error: unknown): error is SqliteError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "string" &&
    "errno" in error &&
    typeof (error as any).errno === "number"
  );
}

export function verifyRequestOrigin(origin: string, allowedHosts: string[]): boolean {
  try {
    const originUrl = new URL(origin);
    return allowedHosts.includes(originUrl.host);
  } catch {
    return false;
  }
}
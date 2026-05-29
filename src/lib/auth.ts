import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE = "cgr_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  const s = process.env.AUTH_SECRET;
  // Fail-fast: no hardcoded fallback. A weak/missing key would let anyone forge
  // admin session cookies, so we refuse to sign or verify without a strong secret.
  if (!s || s.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a random string of at least 32 characters (e.g. `openssl rand -hex 32`)."
    );
  }
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function makeToken(adminId: string): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${adminId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [adminId, exp, sig] = parts;
  const expected = sign(`${adminId}.${exp}`);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  if (Date.now() > Number(exp)) return null;
  return adminId;
}

export async function login(email: string, password: string): Promise<boolean> {
  const admin = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!admin) return false;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return false;
  const jar = await cookies();
  jar.set(COOKIE, makeToken(admin.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminId(): Promise<string | null> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

// Server-side auth guard for admin pages/actions. This is the REAL guarantee:
// every protected admin server page must call this at the very top, before any
// DB access, so unauthenticated requests never trigger queries or leak data.
// Redirects to the login page when there is no valid session.
export async function requireAdmin(): Promise<string> {
  const id = await getAdminId();
  if (!id) redirect("/admin/login");
  return id;
}

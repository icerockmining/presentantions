import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE = "cgr_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.AUTH_SECRET || "dev-secret-change-in-production-please-32chars";
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

export async function requireAdmin(): Promise<string> {
  const id = await getAdminId();
  if (!id) throw new Error("UNAUTHORIZED");
  return id;
}

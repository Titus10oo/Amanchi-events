import { cookies } from "next/headers";
import { readDb, publicUser } from "./db";

export const roles = {
  owner: ["events:read", "events:create", "events:update", "users:read", "analytics:read", "finance:read"],
  admin: ["events:read", "events:create", "events:update", "users:read", "analytics:read", "finance:read"],
  manager: ["events:read", "events:create", "events:update", "analytics:read"],
  check_in: ["events:read", "checkin:update"],
  analyst: ["events:read", "analytics:read"],
  viewer: ["events:read"]
};

const sessionCookie = "amanchi_session";

export function createSessionValue(user) {
  return Buffer.from(JSON.stringify({ userId: user.id, role: user.role }), "utf8").toString("base64url");
}

export function parseSessionValue(value) {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function setSession(user) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, createSessionValue(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = parseSessionValue(cookieStore.get(sessionCookie)?.value);
  if (!session?.userId) return null;

  const db = await readDb();
  const user = db.users.find((item) => item.id === session.userId);
  return publicUser(user);
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  return user;
}

export function can(user, permission) {
  return Boolean(user && roles[user.role]?.includes(permission));
}

export function assertPermission(user, permission) {
  if (!can(user, permission)) {
    const error = new Error("You do not have permission to perform this action");
    error.status = 403;
    throw error;
  }
}

export function authErrorResponse(error) {
  return Response.json({ error: error.message || "Request failed" }, { status: error.status || 500 });
}

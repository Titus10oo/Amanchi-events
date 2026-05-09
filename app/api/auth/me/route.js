import { getSessionUser, roles } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  return Response.json({ user, permissions: user ? roles[user.role] || [] : [] });
}

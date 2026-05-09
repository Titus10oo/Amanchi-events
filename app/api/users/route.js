import { authErrorResponse, assertPermission, requireUser } from "@/lib/auth";
import { publicUser, readDb } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireUser();
    assertPermission(user, "users:read");
    const db = await readDb();
    return Response.json({ users: db.users.map(publicUser) });
  } catch (error) {
    return authErrorResponse(error);
  }
}

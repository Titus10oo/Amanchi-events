import { readDb, publicUser } from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function POST(request) {
  const { email, password } = await request.json();
  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === String(email || "").toLowerCase());

  if (!user || user.password !== password) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setSession(user);
  return Response.json({ user: publicUser(user) });
}

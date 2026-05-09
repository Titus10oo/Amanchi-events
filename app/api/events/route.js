import { authErrorResponse, assertPermission, can, requireUser } from "@/lib/auth";
import { publicEvent, readDb, writeDb } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireUser();
    assertPermission(user, "events:read");
    const db = await readDb();
    return Response.json({ events: db.events.map(publicEvent) });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    assertPermission(user, "events:create");

    const data = await request.json();
    const event = {
      id: `evt_${Date.now()}`,
      title: String(data.title || "").trim(),
      format: data.format || "Hybrid",
      date: data.date,
      city: data.format === "Online" ? "Remote" : data.city || "TBD",
      status: can(user, "events:update") ? "Draft" : "Pending",
      registrations: 0,
      capacity: Number(data.capacity || 120),
      revenue: 0,
      price: Number(data.price || 0),
      approval: data.approval || "Auto-approve",
      waitlist: 0,
      sessions: data.format === "Multi-session" ? 4 : 1,
      conversion: 0,
      source: "New",
      createdBy: user.id
    };

    if (!event.title || !event.date) {
      return Response.json({ error: "Title and date are required" }, { status: 400 });
    }

    const db = await readDb();
    db.events.unshift(event);
    await writeDb(db);
    return Response.json({ event }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}

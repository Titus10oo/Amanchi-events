import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "amanchi-db.json");

const seed = {
  users: [
    {
      id: "usr_owner",
      name: "Titus Emmanuel",
      email: "titusemma2017@gmail.com",
      role: "owner",
      password: "amanchi-owner"
    },
    {
      id: "usr_manager",
      name: "Event Manager",
      email: "manager@amanchi.test",
      role: "manager",
      password: "amanchi-manager"
    },
    {
      id: "usr_checkin",
      name: "Check-in Lead",
      email: "checkin@amanchi.test",
      role: "check_in",
      password: "amanchi-checkin"
    }
  ],
  events: [
    {
      id: "evt_operators",
      title: "Operators Circle: Growth Systems",
      format: "Hybrid",
      date: "2026-05-22",
      city: "Lagos",
      status: "Live",
      registrations: 184,
      capacity: 220,
      revenue: 9200,
      price: 50,
      approval: "Domain rules",
      waitlist: 17,
      sessions: 3,
      conversion: 42,
      source: "Newsletter",
      createdBy: "usr_owner"
    },
    {
      id: "evt_design",
      title: "Design Systems Clinic",
      format: "Online",
      date: "2026-05-29",
      city: "Remote",
      status: "Draft",
      registrations: 68,
      capacity: 120,
      revenue: 0,
      price: 0,
      approval: "Manual review",
      waitlist: 0,
      sessions: 1,
      conversion: 31,
      source: "Partner",
      createdBy: "usr_manager"
    },
    {
      id: "evt_ai",
      title: "AI Builders Summit",
      format: "Multi-session",
      date: "2026-06-12",
      city: "Abuja",
      status: "Live",
      registrations: 412,
      capacity: 500,
      revenue: 61800,
      price: 150,
      approval: "Auto-approve",
      waitlist: 43,
      sessions: 8,
      conversion: 48,
      source: "Referral",
      createdBy: "usr_owner"
    }
  ],
  guests: [
    ["Amara Okeke", "Founder", "VIP", "Checked in", "Operators Circle", "LinkedIn"],
    ["Tunde Balogun", "Engineer", "Regular", "Approved", "AI Builders Summit", "Newsletter"],
    ["Mina Ford", "Investor", "Sponsor", "Pending", "AI Builders Summit", "Partner"],
    ["Ife Adebayo", "Designer", "First timer", "Waitlisted", "Design Systems Clinic", "Search"],
    ["Chris Morgan", "Ops Lead", "Regular", "Approved", "Operators Circle", "Referral"],
    ["Zara Bello", "Product", "Member", "Approved", "Design Systems Clinic", "Community"]
  ]
};

export async function readDb() {
  await mkdir(dataDir, { recursive: true });

  try {
    const file = await readFile(dbPath, "utf8");
    return JSON.parse(file);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeDb(seed);
    return structuredClone(seed);
  }
}

export async function writeDb(data) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function publicUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function publicEvent(event) {
  return event;
}

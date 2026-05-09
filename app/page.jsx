"use client";

import { useMemo, useState } from "react";

const initialEvents = [
  {
    id: 1,
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
    source: "Newsletter"
  },
  {
    id: 2,
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
    source: "Partner"
  },
  {
    id: 3,
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
    source: "Referral"
  }
];

const guests = [
  ["Amara Okeke", "Founder", "VIP", "Checked in", "Operators Circle", "LinkedIn"],
  ["Tunde Balogun", "Engineer", "Regular", "Approved", "AI Builders Summit", "Newsletter"],
  ["Mina Ford", "Investor", "Sponsor", "Pending", "AI Builders Summit", "Partner"],
  ["Ife Adebayo", "Designer", "First timer", "Waitlisted", "Design Systems Clinic", "Search"],
  ["Chris Morgan", "Ops Lead", "Regular", "Approved", "Operators Circle", "Referral"],
  ["Zara Bello", "Product", "Member", "Approved", "Design Systems Clinic", "Community"]
];

const campaigns = [
  { name: "Invite high-intent founders", segment: "Past attendees + founders", channel: "Email + WhatsApp", status: "Scheduled", metric: "38% RSVP" },
  { name: "Recover checkout drop-offs", segment: "Started checkout", channel: "Email", status: "Automated", metric: "14 recovered" },
  { name: "Post-event sponsor report", segment: "Sponsors", channel: "PDF + email", status: "Draft", metric: "AI summary ready" }
];

const integrations = [
  ["Stripe", "Payments, payouts, receipts", "Connected"],
  ["Zoom", "Meetings, webinars, attendance", "Connected"],
  ["Google Meet", "Auto meeting links", "Available"],
  ["HubSpot", "CRM sync and lifecycle stages", "Suggested"],
  ["Slack", "Team alerts and guest ops", "Suggested"],
  ["Webhooks", "Calendar and order events", "Active"],
  ["API", "Events, guests, orders, analytics", "Plus"],
  ["SSO / SCIM", "Enterprise identity controls", "Enterprise"]
];

const navItems = [
  ["overview", "H", "Overview"],
  ["events", "E", "Events"],
  ["guests", "G", "Guests"],
  ["campaigns", "@", "Campaigns"],
  ["analytics", "A", "Analytics"],
  ["commerce", "$", "Commerce"],
  ["integrations", "I", "Integrations"]
];

const titles = {
  overview: "Organizer Overview",
  events: "Events",
  guests: "Guest CRM",
  campaigns: "Campaigns",
  analytics: "Analytics",
  commerce: "Commerce",
  integrations: "Integrations"
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Home() {
  const [view, setView] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const searched = !normalized
      ? events
      : events.filter((event) =>
          [event.title, event.format, event.city, event.status, event.approval, event.source]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        );

    return searched.filter((event) => {
      if (filter === "all") return true;
      if (filter === "multi-session") return event.format === "Multi-session";
      return event.status.toLowerCase() === filter;
    });
  }, [events, filter, query]);

  const addEvent = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const format = data.get("format");
    setEvents((current) => [
      {
        id: Date.now(),
        title: data.get("title"),
        format,
        date: data.get("date"),
        city: format === "Online" ? "Remote" : "TBD",
        status: "Draft",
        registrations: 0,
        capacity: Number(data.get("capacity")),
        revenue: 0,
        price: Number(data.get("price")),
        approval: data.get("approval"),
        waitlist: 0,
        sessions: format === "Multi-session" ? 4 : 1,
        conversion: 0,
        source: "New"
      },
      ...current
    ]);
    event.currentTarget.reset();
    setShowModal(false);
    setView("events");
  };

  return (
    <div className={`app-shell ${compact ? "compact" : ""}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">A</div>
          <div>
            <strong>Amanchi</strong>
            <span>Event OS</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(([key, icon, label]) => (
            <button className={`nav-item ${view === key ? "is-active" : ""}`} key={key} onClick={() => setView(key)}>
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="plan-card">
          <span>Plus workspace</span>
          <strong>72% send capacity</strong>
          <div className="meter"><span style={{ width: "72%" }} /></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Amanchi Events</p>
            <h1>{titles[view]}</h1>
          </div>
          <div className="topbar-actions">
            <div className="searchbox">
              <span aria-hidden="true">?</span>
              <input type="search" placeholder="Search events, guests, campaigns" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <button className="icon-button" aria-label="Toggle density" title="Toggle density" onClick={() => setCompact((value) => !value)}>D</button>
            <button className="primary-button" onClick={() => setShowModal(true)}>Create event</button>
          </div>
        </header>

        <section className="workspace">
          {view === "overview" && <Overview events={events} setView={setView} />}
          {view === "events" && <EventsView events={filteredEvents} filter={filter} setFilter={setFilter} openModal={() => setShowModal(true)} />}
          {view === "guests" && <GuestsView query={query} />}
          {view === "campaigns" && <CampaignsView />}
          {view === "analytics" && <AnalyticsView />}
          {view === "commerce" && <CommerceView />}
          {view === "integrations" && <IntegrationsView />}
        </section>
      </main>

      {showModal && (
        <div className="modal-backdrop" role="presentation">
          <form className="modal-panel" onSubmit={addEvent}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">New event</p>
                <h2>Create an event</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Close" onClick={() => setShowModal(false)}>x</button>
            </div>
            <div className="form-grid">
              <label>
                Event title
                <input name="title" required placeholder="Founders Breakfast Lagos" />
              </label>
              <label>
                Format
                <select name="format">
                  <option>Hybrid</option>
                  <option>In-person</option>
                  <option>Online</option>
                  <option>Multi-session</option>
                </select>
              </label>
              <label>
                Date
                <input name="date" type="date" required />
              </label>
              <label>
                Capacity
                <input name="capacity" type="number" min="10" defaultValue="120" />
              </label>
              <label>
                Ticket price
                <input name="price" type="number" min="0" defaultValue="0" />
              </label>
              <label>
                Approval
                <select name="approval">
                  <option>Auto-approve</option>
                  <option>Manual review</option>
                  <option>Domain rules</option>
                </select>
              </label>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" type="button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="primary-button" type="submit">Publish draft</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Overview({ events, setView }) {
  const registrations = events.reduce((sum, event) => sum + event.registrations, 0);
  const revenue = events.reduce((sum, event) => sum + event.revenue, 0);
  const capacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const waitlist = events.reduce((sum, event) => sum + event.waitlist, 0);

  return (
    <>
      <div className="hero-panel">
        <section className="panel event-feature">
          <div>
            <p className="eyebrow">Improved event platform</p>
            <h2>Run Amanchi events, memberships, comms, ticketing, and sponsor ops in one place.</h2>
            <ul className="feature-list">
              <li>Current Luma-style event pages, RSVPs, ticketing, payments, check-in, blasts, calendars, chat, and integrations.</li>
              <li>Added multi-session scheduling, conditional registration, segmentation, memberships, reserved seating, and richer analytics.</li>
              <li>Enterprise controls for SSO, audit logs, role policies, sender domains, and data exports.</li>
            </ul>
            <button className="primary-button" onClick={() => setView("events")}>Manage events</button>
            <button className="secondary-button" onClick={() => setView("campaigns")}>Build campaign</button>
          </div>
          <div className="event-art" role="img" aria-label="Stylized venue and event operations illustration" />
        </section>
        <section className="timeline">
          <TimelineStep step="1" title="Registration rules" body="Auto-approve domains, branch questions, and ticket-specific forms" status="Live" />
          <TimelineStep step="2" title="Audience segments" body="First-timers, VIPs, sponsors, no-shows, and high-referrers" status="Ready" />
          <TimelineStep step="3" title="Post-event AI" body="Feedback clusters, sponsor report, and follow-up drafts" status="Queued" />
          <TimelineStep step="4" title="Finance close" body="Reconcile revenue, refunds, tax, and payout exports" status="Open" />
        </section>
      </div>
      <section className="stat-grid">
        <Stat label="Registrations" value={registrations} delta="+18% vs last month" />
        <Stat label="Revenue" value={currency.format(revenue)} delta="Stripe payouts active" />
        <Stat label="Capacity filled" value={`${Math.round((registrations / capacity) * 100)}%`} delta={`${waitlist} waitlisted`} />
        <Stat label="Repeat attendance" value="46%" delta="+9 pts retention" />
      </section>
      <section className="split-panel">
        <div className="panel">
          <div className="toolbar">
            <div>
              <p className="eyebrow">Upcoming</p>
              <h2>Priority events</h2>
            </div>
            <button className="ghost-button" onClick={() => setView("events")}>View all</button>
          </div>
          <div className="grid-3">{events.map((event) => <EventCard event={event} key={event.id} />)}</div>
        </div>
        <div className="canvas-panel">
          <p className="eyebrow">Conversion</p>
          <h2>Registration funnel</h2>
          <Funnel />
        </div>
      </section>
    </>
  );
}

function EventsView({ events, filter, setFilter, openModal }) {
  return (
    <>
      <section className="toolbar">
        <div className="segmented" role="tablist" aria-label="Event filter">
          {["all", "live", "draft", "multi-session"].map((item) => (
            <button className={filter === item ? "is-active" : ""} key={item} onClick={() => setFilter(item)}>
              {label(item)}
            </button>
          ))}
        </div>
        <button className="primary-button" onClick={openModal}>Create event</button>
      </section>
      <section className="grid-3">
        {events.length ? events.map((event) => <EventCard event={event} key={event.id} />) : <EmptyState text="No events match this filter." />}
      </section>
      <section className="panel">
        <p className="eyebrow">Event builder upgrades</p>
        <h2>Advanced setup checklist</h2>
        <div className="timeline">
          <TimelineStep step="+" title="Multi-session agenda" body="Create workshops, tracks, room capacity, and session-specific check-in" status="Enabled" />
          <TimelineStep step="+" title="Conditional registration" body="Branch questions by role, company size, ticket type, or approval status" status="Enabled" />
          <TimelineStep step="+" title="Reserved seating" body="Tables, rows, VIP zones, and sponsor allocations" status="Beta" />
          <TimelineStep step="+" title="Approval automation" body="Domain rules, invite codes, member status, fraud scoring" status="Enabled" />
        </div>
      </section>
    </>
  );
}

function GuestsView({ query }) {
  const rows = guests.filter((guest) => !query || guest.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <section className="stat-grid">
        <Stat label="Guest profiles" value="12,480" delta="Unified across calendars" />
        <Stat label="Segments" value="24" delta="6 automated" />
        <Stat label="No-show risk" value="11%" delta="AI scored" />
        <Stat label="Referral leaders" value="38" delta="Eligible for rewards" />
      </section>
      <section className="table-wrap">
        <table>
          <thead>
            <tr><th>Guest</th><th>Segment</th><th>Status</th><th>Event</th><th>Source</th><th>Action</th></tr>
          </thead>
          <tbody>
            {rows.map((guest) => <GuestRow guest={guest} key={guest[0]} />)}
          </tbody>
        </table>
      </section>
      <section className="panel">
        <p className="eyebrow">Registration improvements</p>
        <h2>Rules engine</h2>
        <div className="grid-3">
          <MiniCard title="Conditional forms" body="Ask sponsor questions only on sponsor tickets and branch founder questions by company stage." />
          <MiniCard title="Approval rules" body="Approve invited domains, hold free-ticket spikes, and flag duplicates before capacity is consumed." />
          <MiniCard title="Lifecycle tags" body="Automatically mark first-timers, members, no-shows, high-referrers, and VIPs." />
        </div>
      </section>
    </>
  );
}

function CampaignsView() {
  return (
    <>
      <section className="kanban">
        <CampaignColumn status="Draft" />
        <CampaignColumn status="Scheduled" />
        <CampaignColumn status="Automated" />
      </section>
      <section className="panel">
        <p className="eyebrow">Comms upgrades</p>
        <h2>Campaign automation</h2>
        <div className="grid-3">
          <MiniCard title="Segmented blasts" body="Target people by attendance, ticket type, city, source, company, and engagement." />
          <MiniCard title="A/B testing" body="Test subject lines, send windows, and event-page variants against RSVP conversion." />
          <MiniCard title="Sponsor placements" body="Track impressions, clicks, registrations, and attendee fit for each sponsor." />
        </div>
      </section>
    </>
  );
}

function AnalyticsView() {
  return (
    <>
      <section className="split-panel">
        <div className="canvas-panel">
          <p className="eyebrow">Source attribution</p>
          <h2>Registrations by channel</h2>
          <div className="chart">
            {[58, 44, 72, 35, 61, 87, 50].map((height, index) => (
              <div className="bar" key={height + index}>
                <span style={{ height: `${height}%` }} />
                <small>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">Funnel intelligence</p>
          <h2>What to fix next</h2>
          <ul className="feature-list">
            <li>Checkout drop-off is highest on mobile paid tickets above $100.</li>
            <li>Referral attendees are 2.1x more likely to return within 60 days.</li>
            <li>Guests who answer optional company questions convert into members 18% more often.</li>
            <li>Friday 10:00 local sends outperform evening sends for founder segments.</li>
          </ul>
        </div>
      </section>
      <section className="stat-grid">
        <Stat label="Page views" value="31.2k" delta="+24%" />
        <Stat label="Start checkout" value="5.9k" delta="19% of views" />
        <Stat label="Paid conversion" value="42%" delta="+6 pts" />
        <Stat label="Returning guests" value="46%" delta="+9 pts" />
      </section>
    </>
  );
}

function CommerceView() {
  return (
    <>
      <section className="stat-grid">
        <Stat label="Gross revenue" value={currency.format(71000)} delta="+31%" />
        <Stat label="Membership MRR" value={currency.format(12800)} delta="420 active" />
        <Stat label="Refund rate" value="1.8%" delta="Healthy" />
        <Stat label="Sponsor pipeline" value={currency.format(54000)} delta="7 proposals" />
      </section>
      <section className="grid-3">
        <MiniCard title="Ticket bundles" body="Season passes, conference plus workshop packages, and group invoices for teams." />
        <MiniCard title="Membership tiers" body="Free, pro, VIP, sponsor, and company memberships with event perks." />
        <MiniCard title="Upsells" body="Merch, donations, VIP dinners, paid recordings, and private sessions at checkout." />
        <MiniCard title="Accounting exports" body="Payout reconciliation, refunds, tax/VAT, coupons, and per-ticket-type revenue." />
        <MiniCard title="Sponsor reports" body="Audience fit, attendance, engagement, impressions, clicks, and AI summary." />
        <MiniCard title="Affiliate payouts" body="Reward partners and high-referrers with tracked commissions." />
      </section>
    </>
  );
}

function IntegrationsView() {
  return (
    <>
      <section className="table-wrap">
        <table>
          <thead><tr><th>Integration</th><th>Use</th><th>Status</th><th>Control</th></tr></thead>
          <tbody>
            {integrations.map(([name, use, status]) => (
              <tr key={name}>
                <td><strong>{name}</strong></td>
                <td>{use}</td>
                <td><span className={`badge ${status === "Connected" || status === "Active" ? "green" : status === "Enterprise" ? "yellow" : ""}`}>{status}</span></td>
                <td><button className="secondary-button">Configure</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="panel">
        <p className="eyebrow">Enterprise controls</p>
        <h2>Admin and security layer</h2>
        <div className="grid-3">
          <MiniCard title="SSO + SCIM" body="Provision users, enforce domains, map roles, and revoke access centrally." />
          <MiniCard title="Audit logs" body="Track event edits, exports, refunds, permission changes, and integration activity." />
          <MiniCard title="Data policies" body="Sender domains, DPA, CCPA/GDPR exports, allowed integrations, and retention settings." />
        </div>
      </section>
    </>
  );
}

function EventCard({ event }) {
  const ratio = Math.min(100, Math.round((event.registrations / event.capacity) * 100));
  return (
    <article className="item-card">
      <header>
        <div>
          <h3>{event.title}</h3>
          <div className="meta-row"><span>{event.date}</span><span>{event.city}</span><span>{event.format}</span></div>
        </div>
        <span className={`badge ${event.status === "Live" ? "green" : "yellow"}`}>{event.status}</span>
      </header>
      <div className="progress-row">
        <div><span>{event.registrations}/{event.capacity} registered</span><strong>{ratio}%</strong></div>
        <div className="progress"><span style={{ width: `${ratio}%` }} /></div>
      </div>
      <div className="meta-row">
        <span>{currency.format(event.revenue)}</span>
        <span>{event.waitlist} waitlist</span>
        <span>{event.sessions} session{event.sessions > 1 ? "s" : ""}</span>
      </div>
      <button className="secondary-button">Open event</button>
    </article>
  );
}

function Stat({ label: labelText, value, delta }) {
  return <article className="stat-card"><span>{labelText}</span><strong>{value}</strong><p className="delta">{delta}</p></article>;
}

function TimelineStep({ step, title, body, status }) {
  return (
    <div className="timeline-step">
      <span className="step-dot">{step}</span>
      <div><strong>{title}</strong><div className="meta-row">{body}</div></div>
      <span className="status-pill green">{status}</span>
    </div>
  );
}

function MiniCard({ title, body }) {
  return <article className="item-card"><h3>{title}</h3><p className="meta-row">{body}</p></article>;
}

function GuestRow({ guest }) {
  const [name, role, segment, status, event, source] = guest;
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  const tone = status === "Pending" || status === "Waitlisted" ? "yellow" : "green";
  return (
    <tr>
      <td><div className="person"><span className="avatar">{initials}</span><div><strong>{name}</strong><div className="meta-row">{role}</div></div></div></td>
      <td>{segment}</td>
      <td><span className={`badge ${tone}`}>{status}</span></td>
      <td>{event}</td>
      <td>{source}</td>
      <td><button className="secondary-button">Review</button></td>
    </tr>
  );
}

function CampaignColumn({ status }) {
  const ideas = {
    Draft: ["Speaker announcement", "Members + previous attendees", "LinkedIn, email"],
    Scheduled: ["Waitlist conversion", "Waitlisted guests", "SMS"],
    Automated: ["No-show recovery", "Missed last event", "Email"]
  };

  return (
    <div className="kanban-column">
      <h3>{status}</h3>
      {campaigns.filter((campaign) => campaign.status === status).map((campaign) => (
        <article className="kanban-card" key={campaign.name}>
          <h3>{campaign.name}</h3>
          <p className="meta-row">{campaign.segment}</p>
          <div className="meta-row"><span>{campaign.channel}</span><span>{campaign.metric}</span></div>
        </article>
      ))}
      <article className="kanban-card">
        <h3>{ideas[status][0]}</h3>
        <p className="meta-row">{ideas[status][1]}</p>
        <span className="badge">{ideas[status][2]}</span>
      </article>
    </div>
  );
}

function Funnel() {
  const rows = [
    ["Page views", "31,240", 100],
    ["Registration starts", "8,410", 64],
    ["Questions completed", "7,530", 57],
    ["Checkout completed", "3,560", 42]
  ];

  return rows.map(([labelText, value, width]) => (
    <div className="progress-row funnel-row" key={labelText}>
      <div><span>{labelText}</span><strong>{value}</strong></div>
      <div className="progress"><span style={{ width: `${width}%` }} /></div>
    </div>
  ));
}

function EmptyState({ text }) {
  return <div className="panel"><p>{text}</p></div>;
}

function label(value) {
  return value.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

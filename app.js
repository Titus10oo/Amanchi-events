const state = {
  view: "overview",
  filter: "all",
  query: "",
  compact: false,
  events: [
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
  ],
  guests: [
    ["Amara Okeke", "Founder", "VIP", "Checked in", "Operators Circle", "LinkedIn"],
    ["Tunde Balogun", "Engineer", "Regular", "Approved", "AI Builders Summit", "Newsletter"],
    ["Mina Ford", "Investor", "Sponsor", "Pending", "AI Builders Summit", "Partner"],
    ["Ife Adebayo", "Designer", "First timer", "Waitlisted", "Design Systems Clinic", "Search"],
    ["Chris Morgan", "Ops Lead", "Regular", "Approved", "Operators Circle", "Referral"],
    ["Zara Bello", "Product", "Member", "Approved", "Design Systems Clinic", "Community"]
  ],
  campaigns: [
    { name: "Invite high-intent founders", segment: "Past attendees + founders", channel: "Email + WhatsApp", status: "Scheduled", metric: "38% RSVP" },
    { name: "Recover checkout drop-offs", segment: "Started checkout", channel: "Email", status: "Automated", metric: "14 recovered" },
    { name: "Post-event sponsor report", segment: "Sponsors", channel: "PDF + email", status: "Draft", metric: "AI summary ready" }
  ],
  integrations: [
    ["Stripe", "Payments, payouts, receipts", "Connected"],
    ["Zoom", "Meetings, webinars, attendance", "Connected"],
    ["Google Meet", "Auto meeting links", "Available"],
    ["HubSpot", "CRM sync and lifecycle stages", "Suggested"],
    ["Slack", "Team alerts and guest ops", "Suggested"],
    ["Webhooks", "Calendar and order events", "Active"],
    ["API", "Events, guests, orders, analytics", "Plus"],
    ["SSO / SCIM", "Enterprise identity controls", "Enterprise"]
  ]
};

const workspace = document.querySelector("#workspace");
const viewTitle = document.querySelector("#viewTitle");
const modal = document.querySelector("#eventModal");
const form = document.querySelector("#eventForm");

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

function init() {
  document.querySelector("#navList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    state.view = button.dataset.view;
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item === button));
    render();
  });

  document.querySelector("#globalSearch").addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });

  document.querySelector("#createEventBtn").addEventListener("click", () => {
    const date = form.elements.date;
    date.valueAsDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    modal.showModal();
  });

  document.querySelector("#themeToggle").addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("compact", state.compact);
  });

  form.addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    const data = new FormData(form);
    state.events.unshift({
      id: Date.now(),
      title: data.get("title"),
      format: data.get("format"),
      date: data.get("date"),
      city: data.get("format") === "Online" ? "Remote" : "TBD",
      status: "Draft",
      registrations: 0,
      capacity: Number(data.get("capacity")),
      revenue: 0,
      price: Number(data.get("price")),
      approval: data.get("approval"),
      waitlist: 0,
      sessions: data.get("format") === "Multi-session" ? 4 : 1,
      conversion: 0,
      source: "New"
    });
    form.reset();
    modal.close();
    state.view = "events";
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === "events"));
    render();
  });

  render();
}

function render() {
  viewTitle.textContent = titles[state.view];
  const views = {
    overview: renderOverview,
    events: renderEvents,
    guests: renderGuests,
    campaigns: renderCampaigns,
    analytics: renderAnalytics,
    commerce: renderCommerce,
    integrations: renderIntegrations
  };
  workspace.innerHTML = views[state.view]();
  bindWorkspaceActions();
}

function getFilteredEvents() {
  if (!state.query) return state.events;
  return state.events.filter((event) => {
    return [event.title, event.format, event.city, event.status, event.approval, event.source]
      .join(" ")
      .toLowerCase()
      .includes(state.query);
  });
}

function renderOverview() {
  const registrations = state.events.reduce((sum, event) => sum + event.registrations, 0);
  const revenue = state.events.reduce((sum, event) => sum + event.revenue, 0);
  const capacity = state.events.reduce((sum, event) => sum + event.capacity, 0);
  const waitlist = state.events.reduce((sum, event) => sum + event.waitlist, 0);

  return `
    <div class="hero-panel">
      <section class="panel event-feature">
        <div>
          <p class="eyebrow">Improved event platform</p>
          <h2>Run Amanchi events, memberships, comms, ticketing, and sponsor ops in one place.</h2>
          <ul class="feature-list">
            <li>Current Luma-style event pages, RSVPs, ticketing, payments, check-in, blasts, calendars, chat, and integrations.</li>
            <li>Added multi-session scheduling, conditional registration, segmentation, memberships, reserved seating, and richer analytics.</li>
            <li>Enterprise controls for SSO, audit logs, role policies, sender domains, and data exports.</li>
          </ul>
          <button class="primary-button" data-view-jump="events">Manage events</button>
          <button class="secondary-button" data-view-jump="campaigns">Build campaign</button>
        </div>
        <div class="event-art" role="img" aria-label="Stylized venue and event operations illustration"></div>
      </section>
      <section class="timeline">
        ${timelineStep("1", "Registration rules", "Auto-approve domains, branch questions, and ticket-specific forms", "Live")}
        ${timelineStep("2", "Audience segments", "First-timers, VIPs, sponsors, no-shows, and high-referrers", "Ready")}
        ${timelineStep("3", "Post-event AI", "Feedback clusters, sponsor report, and follow-up drafts", "Queued")}
        ${timelineStep("4", "Finance close", "Reconcile revenue, refunds, tax, and payout exports", "Open")}
      </section>
    </div>
    <section class="stat-grid">
      ${stat("Registrations", registrations, "+18% vs last month")}
      ${stat("Revenue", currency.format(revenue), "Stripe payouts active")}
      ${stat("Capacity filled", `${Math.round((registrations / capacity) * 100)}%`, `${waitlist} waitlisted`)}
      ${stat("Repeat attendance", "46%", "+9 pts retention")}
    </section>
    <section class="split-panel">
      <div class="panel">
        <div class="toolbar">
          <div>
            <p class="eyebrow">Upcoming</p>
            <h2>Priority events</h2>
          </div>
          <button class="ghost-button" data-view-jump="events">View all</button>
        </div>
        <div class="grid-3">${state.events.map(eventCard).join("")}</div>
      </div>
      <div class="canvas-panel">
        <p class="eyebrow">Conversion</p>
        <h2>Registration funnel</h2>
        ${funnelMarkup()}
      </div>
    </section>
  `;
}

function renderEvents() {
  return `
    <section class="toolbar">
      <div class="segmented" role="tablist" aria-label="Event filter">
        ${["all", "live", "draft", "multi-session"].map((filter) => `<button class="${state.filter === filter ? "is-active" : ""}" data-filter="${filter}">${label(filter)}</button>`).join("")}
      </div>
      <button class="primary-button" data-open-modal>Create event</button>
    </section>
    <section class="grid-3">${filterEventsByMode().map(eventCard).join("") || emptyState("No events match this filter.")}</section>
    <section class="panel">
      <p class="eyebrow">Event builder upgrades</p>
      <h2>Advanced setup checklist</h2>
      <div class="timeline">
        ${timelineStep("+", "Multi-session agenda", "Create workshops, tracks, room capacity, and session-specific check-in", "Enabled")}
        ${timelineStep("+", "Conditional registration", "Branch questions by role, company size, ticket type, or approval status", "Enabled")}
        ${timelineStep("+", "Reserved seating", "Tables, rows, VIP zones, and sponsor allocations", "Beta")}
        ${timelineStep("+", "Approval automation", "Domain rules, invite codes, member status, fraud scoring", "Enabled")}
      </div>
    </section>
  `;
}

function renderGuests() {
  const rows = state.guests.filter((guest) => !state.query || guest.join(" ").toLowerCase().includes(state.query));
  return `
    <section class="stat-grid">
      ${stat("Guest profiles", "12,480", "Unified across calendars")}
      ${stat("Segments", "24", "6 automated")}
      ${stat("No-show risk", "11%", "AI scored")}
      ${stat("Referral leaders", "38", "Eligible for rewards")}
    </section>
    <section class="table-wrap">
      <table>
        <thead>
          <tr><th>Guest</th><th>Segment</th><th>Status</th><th>Event</th><th>Source</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${rows.map(guestRow).join("") || `<tr><td colspan="6">${emptyState("No guests found.")}</td></tr>`}
        </tbody>
      </table>
    </section>
    <section class="panel">
      <p class="eyebrow">Registration improvements</p>
      <h2>Rules engine</h2>
      <div class="grid-3">
        ${miniCard("Conditional forms", "Ask sponsor questions only on sponsor tickets and branch founder questions by company stage.")}
        ${miniCard("Approval rules", "Approve invited domains, hold free-ticket spikes, and flag duplicates before capacity is consumed.")}
        ${miniCard("Lifecycle tags", "Automatically mark first-timers, members, no-shows, high-referrers, and VIPs.")}
      </div>
    </section>
  `;
}

function renderCampaigns() {
  return `
    <section class="kanban">
      <div class="kanban-column">
        <h3>Draft</h3>
        ${campaignCards("Draft")}
        ${campaignIdea("Speaker announcement", "Members + previous attendees", "LinkedIn, email")}
      </div>
      <div class="kanban-column">
        <h3>Scheduled</h3>
        ${campaignCards("Scheduled")}
        ${campaignIdea("Waitlist conversion", "Waitlisted guests", "SMS")}
      </div>
      <div class="kanban-column">
        <h3>Automated</h3>
        ${campaignCards("Automated")}
        ${campaignIdea("No-show recovery", "Missed last event", "Email")}
      </div>
    </section>
    <section class="panel">
      <p class="eyebrow">Comms upgrades</p>
      <h2>Campaign automation</h2>
      <div class="grid-3">
        ${miniCard("Segmented blasts", "Target people by attendance, ticket type, city, source, company, and engagement.")}
        ${miniCard("A/B testing", "Test subject lines, send windows, and event-page variants against RSVP conversion.")}
        ${miniCard("Sponsor placements", "Track impressions, clicks, registrations, and attendee fit for each sponsor.")}
      </div>
    </section>
  `;
}

function renderAnalytics() {
  return `
    <section class="split-panel">
      <div class="canvas-panel">
        <p class="eyebrow">Source attribution</p>
        <h2>Registrations by channel</h2>
        <div class="chart">
          ${[58, 44, 72, 35, 61, 87, 50].map((height, index) => `<div class="bar"><span style="height:${height}%"></span><small>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</small></div>`).join("")}
        </div>
      </div>
      <div class="panel">
        <p class="eyebrow">Funnel intelligence</p>
        <h2>What to fix next</h2>
        <ul class="feature-list">
          <li>Checkout drop-off is highest on mobile paid tickets above $100.</li>
          <li>Referral attendees are 2.1x more likely to return within 60 days.</li>
          <li>Guests who answer optional company questions convert into members 18% more often.</li>
          <li>Friday 10:00 local sends outperform evening sends for founder segments.</li>
        </ul>
      </div>
    </section>
    <section class="stat-grid">
      ${stat("Page views", "31.2k", "+24%")}
      ${stat("Start checkout", "5.9k", "19% of views")}
      ${stat("Paid conversion", "42%", "+6 pts")}
      ${stat("Returning guests", "46%", "+9 pts")}
    </section>
  `;
}

function renderCommerce() {
  return `
    <section class="stat-grid">
      ${stat("Gross revenue", currency.format(71000), "+31%")}
      ${stat("Membership MRR", currency.format(12800), "420 active")}
      ${stat("Refund rate", "1.8%", "Healthy")}
      ${stat("Sponsor pipeline", currency.format(54000), "7 proposals")}
    </section>
    <section class="grid-3">
      ${miniCard("Ticket bundles", "Season passes, conference plus workshop packages, and group invoices for teams.")}
      ${miniCard("Membership tiers", "Free, pro, VIP, sponsor, and company memberships with event perks.")}
      ${miniCard("Upsells", "Merch, donations, VIP dinners, paid recordings, and private sessions at checkout.")}
      ${miniCard("Accounting exports", "Payout reconciliation, refunds, tax/VAT, coupons, and per-ticket-type revenue.")}
      ${miniCard("Sponsor reports", "Audience fit, attendance, engagement, impressions, clicks, and AI summary.")}
      ${miniCard("Affiliate payouts", "Reward partners and high-referrers with tracked commissions.")}
    </section>
  `;
}

function renderIntegrations() {
  return `
    <section class="table-wrap">
      <table>
        <thead><tr><th>Integration</th><th>Use</th><th>Status</th><th>Control</th></tr></thead>
        <tbody>
          ${state.integrations.map(([name, use, status]) => `
            <tr>
              <td><strong>${name}</strong></td>
              <td>${use}</td>
              <td><span class="badge ${status === "Connected" || status === "Active" ? "green" : status === "Enterprise" ? "yellow" : ""}">${status}</span></td>
              <td><button class="secondary-button">Configure</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
    <section class="panel">
      <p class="eyebrow">Enterprise controls</p>
      <h2>Admin and security layer</h2>
      <div class="grid-3">
        ${miniCard("SSO + SCIM", "Provision users, enforce domains, map roles, and revoke access centrally.")}
        ${miniCard("Audit logs", "Track event edits, exports, refunds, permission changes, and integration activity.")}
        ${miniCard("Data policies", "Sender domains, DPA, CCPA/GDPR exports, allowed integrations, and retention settings.")}
      </div>
    </section>
  `;
}

function filterEventsByMode() {
  return getFilteredEvents().filter((event) => {
    if (state.filter === "all") return true;
    if (state.filter === "multi-session") return event.format === "Multi-session";
    return event.status.toLowerCase() === state.filter;
  });
}

function bindWorkspaceActions() {
  workspace.querySelectorAll("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.viewJump;
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === state.view));
      render();
    });
  });

  workspace.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });

  workspace.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => modal.showModal());
  });
}

function eventCard(event) {
  const ratio = Math.min(100, Math.round((event.registrations / event.capacity) * 100));
  const badgeClass = event.status === "Live" ? "green" : "yellow";
  return `
    <article class="item-card">
      <header>
        <div>
          <h3>${event.title}</h3>
          <div class="meta-row"><span>${event.date}</span><span>${event.city}</span><span>${event.format}</span></div>
        </div>
        <span class="badge ${badgeClass}">${event.status}</span>
      </header>
      <div class="progress-row">
        <div><span>${event.registrations}/${event.capacity} registered</span><strong>${ratio}%</strong></div>
        <div class="progress"><span style="width:${ratio}%"></span></div>
      </div>
      <div class="meta-row">
        <span>${currency.format(event.revenue)}</span>
        <span>${event.waitlist} waitlist</span>
        <span>${event.sessions} session${event.sessions > 1 ? "s" : ""}</span>
      </div>
      <button class="secondary-button">Open event</button>
    </article>
  `;
}

function stat(labelText, value, delta) {
  return `<article class="stat-card"><span>${labelText}</span><strong>${value}</strong><p class="delta">${delta}</p></article>`;
}

function timelineStep(step, title, body, status) {
  return `
    <div class="timeline-step">
      <span class="step-dot">${step}</span>
      <div><strong>${title}</strong><div class="meta-row">${body}</div></div>
      <span class="status-pill green">${status}</span>
    </div>
  `;
}

function miniCard(title, body) {
  return `<article class="item-card"><h3>${title}</h3><p class="meta-row">${body}</p></article>`;
}

function guestRow([name, role, segment, status, event, source]) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  const tone = status === "Pending" || status === "Waitlisted" ? "yellow" : "green";
  return `
    <tr>
      <td><div class="person"><span class="avatar">${initials}</span><div><strong>${name}</strong><div class="meta-row">${role}</div></div></div></td>
      <td>${segment}</td>
      <td><span class="badge ${tone}">${status}</span></td>
      <td>${event}</td>
      <td>${source}</td>
      <td><button class="secondary-button">Review</button></td>
    </tr>
  `;
}

function campaignCards(status) {
  return state.campaigns
    .filter((campaign) => campaign.status === status)
    .map((campaign) => `
      <article class="kanban-card">
        <h3>${campaign.name}</h3>
        <p class="meta-row">${campaign.segment}</p>
        <div class="meta-row"><span>${campaign.channel}</span><span>${campaign.metric}</span></div>
      </article>
    `)
    .join("");
}

function campaignIdea(name, segment, channel) {
  return `<article class="kanban-card"><h3>${name}</h3><p class="meta-row">${segment}</p><span class="badge">${channel}</span></article>`;
}

function funnelMarkup() {
  const rows = [
    ["Page views", "31,240", 100],
    ["Registration starts", "8,410", 64],
    ["Questions completed", "7,530", 57],
    ["Checkout completed", "3,560", 42]
  ];
  return rows.map(([labelText, value, width]) => `
    <div class="progress-row" style="margin-top:14px">
      <div><span>${labelText}</span><strong>${value}</strong></div>
      <div class="progress"><span style="width:${width}%"></span></div>
    </div>
  `).join("");
}

function label(value) {
  return value.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function emptyState(text) {
  return `<div class="panel"><p>${text}</p></div>`;
}

init();

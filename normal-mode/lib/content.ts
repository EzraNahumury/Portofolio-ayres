export const nav = {
  brand: "AYRES",
  links: [
    { label: "Workflow", href: "#how" },
    { label: "Features", href: "#capabilities" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  // Sends visitors back to the retro site's own homepage — the mirror of
  // the retro site's "Normal Mode" button.
  cta: { label: "Retro Mode", href: "/" },
};

export const hero = {
  badge: "Built natively on Portaldot · ink! · POT gas",
  title: ["Gotong royong,", "now governed by", "AI on Portaldot."],
  subtitle:
    "Auralis turns Indonesia's centuries-old rotating savings (Arisan) into a transparent, AI-governed coordination protocol. Multi-agent reasoning evaluates every withdrawal; the chain enforces the verdict.",
  ctaPrimary: { label: "Launch the app", href: "/app" },
  ctaSecondary: { label: "See the workflow", href: "#workflow" },
  stats: [
    { value: "24h", label: "Max approval window" },
    { value: "≥85%", label: "AI confidence → fast-track" },
    { value: "6", label: "ink! contracts" },
    { value: "256", label: "Portaldot shards" },
  ],
  // FIVA-style hero composition
  headline: [
    [
      { text: "Indonesian", tone: "muted" },
      { text: "Sportswear.", tone: "strong" },
    ],
    [{ text: "Powered by the Web.", tone: "strong" }],
    [
      { text: "Every sale runs on", tone: "muted" },
    ],
    [{ text: "apps we built ourselves.", tone: "strong" }],
  ] as const,
  description:
    "AYRES is an Indonesian sportswear brand from Yogyakarta — and every part of how we sell runs on web apps we built ourselves: AI marketing agents, an online shop, a 24/7 chatbot and a production CRM, all working to turn visitors into orders.",
  openApp: { label: "Chat on WhatsApp", href: "https://wa.me/6287818310416" },
};

export const whatYouCanDo = {
  title: "The Apps Behind Our Sales",
  showMoreLabel: "Show More",
  showLessLabel: "Show Less",
  visibleCount: 6,
  cards: [
    {
      name: "HR Attendance System",
      slug: "hr",
      tag: "HR",
      meshCenter: "HR",
      meshLabels: ["CHECK", "LEAVE", "SHIFT", "PAY", "SLIP", "REPORT"],
      body: "Employee attendance and HR management platform with digital check-in and reporting.",
    },
    {
      name: "Production CRM",
      slug: "crm",
      tag: "CRM",
      meshCenter: "CRM",
      meshLabels: ["LEAD", "QUOTE", "ORDER", "SHIP", "PAID", "FOLLOW"],
      body: "CRM to track production orders, customers and workflow from request to delivery.",
    },
    {
      name: "Social Media AI Agent",
      slug: "ai-medsos",
      tag: "AI AGENT",
      meshCenter: "SOCIAL",
      meshLabels: ["DRAFT", "PLAN", "TAGS", "POST", "STATS", "REPLY"],
      body: "AI agent that drafts, schedules and manages social media content automatically.",
    },
    {
      name: "Marketing AI Agent",
      slug: "ai-marketing",
      tag: "AI AGENT",
      meshCenter: "ADS",
      meshLabels: ["PLAN", "COPY", "TARGET", "BUDGET", "TEST", "REPORT"],
      body: "AI agent that plans campaigns, writes copy and automates marketing across channels.",
    },
    {
      name: "SSB Management",
      slug: "ssb",
      tag: "MANAGEMENT",
      meshCenter: "SSB",
      meshLabels: ["MEMBER", "COACH", "PAY", "SCHED", "ATTEND", "REPORT"],
      body: "Management system for a football academy — members, schedules and payments in one place.",
    },
    {
      name: "Customer Service Chatbot",
      slug: "chatbot",
      tag: "CHATBOT",
      meshCenter: "CHAT",
      meshLabels: ["GREET", "FAQ", "ORDER", "ESCAL", "TRACK", "CLOSE"],
      body: "Conversational chatbot that answers customer questions and handles orders 24/7.",
    },
    {
      name: "Company Profile",
      slug: "company-profile",
      tag: "PROFILE",
      meshCenter: "AYRES",
      meshLabels: ["ABOUT", "TEAM", "NEWS", "PHOTOS", "SERVE", "REACH"],
      body: "Company profile website showcasing the AYRES brand, story and capabilities.",
    },
    {
      name: "Company Landing Page",
      slug: "landing-page",
      tag: "LANDING",
      meshCenter: "LEAD",
      meshLabels: ["HERO", "OFFER", "PROOF", "FAQ", "FORM", "CTA"],
      body: "High-converting landing page to introduce products and capture new leads.",
    },
    {
      name: "AYRES Online Shop",
      slug: "online-shop",
      tag: "E-COMMERCE",
      meshCenter: "SHOP",
      meshLabels: ["BROWSE", "CART", "PAY", "SHIP", "TRACK", "REVIEW"],
      body: "E-commerce storefront for ordering custom jerseys online, end to end.",
    },
    {
      name: "Reseller Web",
      slug: "reseller",
      tag: "RESELLER",
      meshCenter: "RESELL",
      meshLabels: ["JOIN", "CATLOG", "ORDER", "PAYOUT", "TRACK", "REPORT"],
      body: "Portal for resellers to browse products, place orders and track their sales.",
    },
    {
      name: "Invitation Web",
      slug: "invitation",
      tag: "INVITATION",
      meshCenter: "INVITE",
      meshLabels: ["THEME", "RSVP", "PHOTOS", "MUSIC", "MAPS", "SHARE"],
      body: "Digital invitation web builder with elegant, shareable event pages.",
    },
  ],
};

export const howAuralis = {
  title: "How AYRES Optimizes Sales",
  cards: [
    {
      index: "01",
      name: "One Web, Every Channel",
      body:
        "Six of our own apps run the funnel end-to-end — AI ad and social agents pull visitors in, the online shop and chatbot close the sale, the CRM and shipping flow deliver it. An order can travel from first click to doorstep without a single manual handoff.",
    },
    {
      index: "02",
      name: "Visitors Become Repeat Buyers",
      body:
        "Every channel feeds one pipeline: campaigns bring visitors, the shop and chatbot turn them into orders, and on-time delivery turns orders into repeat buyers. Because we built the stack ourselves, we can measure — and optimize — every step of that journey.",
    },
  ],
};

export const problems = [
  {
    title: "Opaque withdrawals",
    body: "Members lose trust when decisions can't be audited. Disputes corrode the group from inside.",
  },
  {
    title: "No measurable credit",
    body: "Approvals fall back on personal favor — not on a record anyone else can verify.",
  },
  {
    title: "Slow coordination",
    body: "Approvals drift across group chats for days. Urgent cases lose to bureaucracy.",
  },
  {
    title: "Bad actors hop groups",
    body: "A defaulter in one Arisan can quietly re-appear in another. No portable signal warns the next group.",
  },
  {
    title: "No accountability for absentees",
    body: "Missed contributions stay invisible. The free-rider problem compounds until the group dissolves.",
  },
];

export const solution = {
  eyebrow: "Solution",
  title: "Six ink! contracts. One coordinated protocol.",
  body:
    "Auralis splits a single group into composable onchain primitives — each with one job, all auditable, all paid in POT.",
  contracts: [
    {
      name: "GroupRegistry",
      role: "Factory + global directory of Arisan groups.",
      tag: "Coordination",
    },
    {
      name: "ArisanGroup",
      role: "Per-group state: members, schedule, balance, withdrawal requests.",
      tag: "Core",
    },
    {
      name: "VotingEngine",
      role: "Reputation-weighted ballots, deadlines, challenge windows, finalization.",
      tag: "Governance",
    },
    {
      name: "ReputationRegistry",
      role: "Per-account score; cross-group lookups for portable trust.",
      tag: "Identity",
    },
    {
      name: "BadgeNFT",
      role: "Soulbound attestations: Consistent Payer, Trusted Member, Dispute-Free.",
      tag: "Identity",
    },
    {
      name: "Treasury",
      role: "Holds POT, releases only on a finalized APPROVED verdict.",
      tag: "Custody",
    },
  ],
};

export const features = [
  {
    icon: "Sparkles",
    title: "Hybrid AI approval",
    body: "Confidence ≥ 85% unlocks a fast-track path: lighter quorum, 12-hour challenge window. Below 50% auto-rejects with a reasoning trail.",
  },
  {
    icon: "Scale",
    title: "Reputation-weighted voting",
    body: "Vote weight = base × reputation_multiplier × badge_multiplier. Long-term contributors carry proportionally more signal.",
  },
  {
    icon: "Zap",
    title: "Optimistic execution",
    body: "Emergency requests can release POT immediately, subject to a challenge window. Any member can pull the brake.",
  },
  {
    icon: "Network",
    title: "Cross-group reputation",
    body: "Agents query reputation across every Auralis group on Portaldot before a vote. A defaulter doesn't get a clean slate.",
  },
  {
    icon: "ShieldCheck",
    title: "Soulbound badges",
    body: "Non-transferable NFTs attest to behavior: Consistent Payer, Trusted Member, Cross-Group Veteran. Portable across the ecosystem.",
  },
  {
    icon: "FileLock",
    title: "Verifiable reasoning",
    body: "Every AI verdict + reviewer vote stores its reasoning CID on IPFS. Onchain holds the hash — the full trace is auditable forever.",
  },
];

export const workflow = {
  eyebrow: "How it works",
  title: "Six steps from request to release.",
  body:
    "Every step is bounded by time and verified onchain. The AI layer recommends; the contract decides.",
  steps: [
    {
      n: "01",
      title: "Member submits request",
      body: "Withdrawal amount + reason hash committed onchain via ArisanGroup contract.",
    },
    {
      n: "02",
      title: "Requester Agent pre-validates",
      body: "Deposit consistency, cross-group history, reputation, reason plausibility — scored in under 10 seconds.",
    },
    {
      n: "03",
      title: "Confidence routes the path",
      body: "≥85% → fast-track. 50–85% → 24h voting. <50% → auto-reject. Routing happens onchain.",
    },
    {
      n: "04",
      title: "Reviewer Agents vote",
      body: "One agent per member reasons independently against the member's configured policy, then casts a weighted onchain ballot.",
    },
    {
      n: "05",
      title: "VotingEngine tallies",
      body: "Quorum met or deadline reached — the engine finalizes APPROVED or REJECTED. No manual gatekeeper.",
    },
    {
      n: "06",
      title: "Treasury releases POT",
      body: "On APPROVED, the Treasury transfers POT to the requester. Reputation updates. Badges may mint.",
    },
  ],
};

export const agents = {
  eyebrow: "Agent topology",
  title: "Two tiers of reasoning. One source of truth.",
  body:
    "Auralis runs a Requester Agent for pre-validation and N Reviewer Agents — one per member, each with a personal policy.",
  tiers: [
    {
      tag: "Tier 1",
      name: "Requester Agent",
      mission: "Pre-validation in under 10 seconds.",
      checks: [
        { label: "Deposit consistency", weight: "25%" },
        { label: "Reputation score", weight: "25%" },
        { label: "Cross-group participation", weight: "15%" },
        { label: "Reason plausibility (LLM)", weight: "15%" },
        { label: "Emergency flag verification", weight: "10%" },
        { label: "Outstanding cross-group debts", weight: "10%" },
      ],
    },
    {
      tag: "Tier 2",
      name: "Reviewer Agents",
      mission: "Independent per-member reasoning + onchain vote.",
      checks: [
        { label: "Reads the request + Tier 1 verdict (as input, not gospel)" },
        { label: "Pulls requester's history, badges, prior votes" },
        { label: "Applies the member's policy: Conservative · Trust-default · Strict-emergency" },
        { label: "Submits Vote(approve, weight, reasoning_cid) onchain" },
        { label: "Reasoning text on IPFS — hash + summary on Portaldot" },
      ],
    },
  ],
};

export const reputation = {
  eyebrow: "Identity",
  title: "Portable reputation, soulbound attestations.",
  body:
    "Reputation is computed from deposit consistency, voting participation, vote quality, group age, badges and cross-group penalties. Score range 0–1000.",
  tiers: [
    { name: "Bronze", range: "0 – 250", accent: "from-amber-700/70 to-amber-500/30" },
    { name: "Silver", range: "251 – 500", accent: "from-zinc-400/60 to-zinc-200/20" },
    { name: "Gold", range: "501 – 750", accent: "from-amber-400/80 to-yellow-200/30" },
    { name: "Platinum", range: "751 – 1000", accent: "from-cyan-200/70 to-violet-200/30" },
  ],
  badges: [
    { name: "Consistent Payer", trigger: "12 on-time deposits in a row", rep: "+50" },
    { name: "Trusted Member", trigger: "≥80% vote agreement over 20 votes", rep: "+75 · 1.2× vote weight" },
    { name: "Group Founder", trigger: "Founded a group with ≥5 active members", rep: "+30" },
    { name: "Dispute-Free", trigger: "6 months with no challenge raised", rep: "+40" },
    { name: "Cross-Group Veteran", trigger: "Active in 3+ groups for 3+ months each", rep: "+60" },
  ],
};

export const preview = {
  eyebrow: "Demo preview",
  title: "Watch a withdrawal pass through the protocol.",
  body:
    "Below is what a member sees when an emergency withdrawal request lands in Arisan Tetangga RT 03. AI verdict on the left; reviewer voting on the right.",
};

export const impact = {
  eyebrow: "Why it matters",
  title: "A 200-million-person primitive, dignified by code.",
  body:
    "Arisan is how Indonesian neighborhoods, families, and offices save together. Auralis preserves the social ritual and removes the failure modes — without asking anyone to learn finance jargon.",
  points: [
    { stat: "200M+", label: "Indonesians culturally familiar with Arisan" },
    { stat: "0 trust assumptions", label: "in AI — final verdict is always the contract" },
    { stat: "100% onchain", label: "deposits, votes, reasoning hashes, payouts" },
    { stat: "Portable", label: "reputation works across every Auralis group" },
  ],
};

export const faq = {
  title: "Frequently Asked Questions",
  hint: "Answers about how AYRES uses technology to drive sales and productivity.",
  community: {
    label: "Still Have Questions?\nChat With Us.",
    href: "https://wa.me/6287818310416",
  },
  items: [
    {
      q: "How does AYRES use technology to grow sales?",
      a: "Beyond making jerseys, AYRES builds its own digital tools — AI agents for marketing and social media, a company website and online shop, and a customer service chatbot — all designed to turn more visitors into orders.",
    },
    {
      q: "What does the Marketing AI Agent actually do?",
      a: "It plans campaigns, writes ad and promo copy, and automates marketing across channels — so the team spends less time on manual content work and more time closing orders.",
    },
    {
      q: "How does the Social Media AI Agent help with content?",
      a: "It drafts, schedules, and manages social media content automatically, keeping AYRES's Instagram and TikTok active and consistent without a full-time content team.",
    },
    {
      q: "Can the chatbot really handle sales conversations?",
      a: "Yes — our Customer Service Chatbot answers product questions and handles orders 24/7, so a lead never goes cold just because it's outside office hours.",
    },
    {
      q: "How do internal tools like the CRM and HR system boost productivity?",
      a: "The Production CRM tracks every order from request to delivery, and the HR Attendance System automates check-ins, payroll and approvals — cutting the manual admin work behind every sale.",
    },
    {
      q: "Do the website and online shop generate leads on their own?",
      a: "Yes — the company landing page and AYRES Online Shop are built to capture leads and orders directly, with a WhatsApp CTA that turns visitors into conversations without needing a sales rep online 24/7.",
    },
    {
      q: "Does AYRES build these systems for other businesses too?",
      a: "Our digital team designs and builds the same kind of platforms — CRM, AI agents, chatbots, e-commerce — as part of a growing digital ecosystem, which you can explore in our Projects section.",
    },
  ],
};

export const ctaSection = {
  title: "Ship a transparent Arisan in a weekend.",
  body:
    "The protocol is open source. The contracts are MIT. The agents are Python. POT pays the gas. Clone the repo and run the local demo.",
  primary: { label: "Open the app", href: "/app" },
  secondary: { label: "GitHub repo", href: "https://github.com/EzraNahumury/auralis" },
};

export const footer = {
  brand: "Auralis",
  tagline: "Gotong royong, on the chain.",
  columns: [
    {
      title: "Protocol",
      links: [
        { label: "Solution", href: "#solution" },
        { label: "Workflow", href: "#workflow" },
        { label: "Reputation", href: "#reputation" },
      ],
    },
    {
      title: "Build",
      links: [
        { label: "GitHub", href: "https://github.com/EzraNahumury/auralis" },
        { label: "Portaldot docs", href: "https://portaldot-dev.readthedocs.io/" },
        { label: "ink!", href: "https://use.ink/" },
      ],
    },
    {
      title: "Hackathon",
      links: [
        { label: "Portaldot Mini S1", href: "https://portaldot-dev.readthedocs.io/" },
        { label: "Discord", href: "https://discord.gg/portaldot" },
      ],
    },
  ],
};

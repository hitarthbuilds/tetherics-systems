export type ImageBlock = { type: "image"; url: string; alt: string; caption?: string; width?: number; height?: number };

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | ImageBlock;

export const categories = ["Brand", "Product thinking", "Philosophy", "Security", "Company"] as const;
export const coverVariants = ["bars", "grid", "orbit", "gate", "bridge"] as const;

export type Post = {
  slug: string;
  title: string;
  dek: string;
  category: (typeof categories)[number];
  date: string;
  author: string;
  cover: (typeof coverVariants)[number];
  coverImage?: { url: string; alt: string; width?: number; height?: number };
  featured?: boolean;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "a-new-mark-for-tetheric",
    title: "A new mark for Tetheric",
    dek: "Three bars, one gradient and a wordmark built like a system. Why our identity looks the way it does.",
    category: "Brand",
    date: "2026-09-25",
    author: "Tetheric Systems",
    cover: "bars",
    featured: true,
    body: [
      { type: "p", text: "Tetheric Systems now has an official identity. The wordmark is set in wide, squared letterforms with a single, even stroke. Nothing in it is decorative for its own sake. It is meant to feel engineered: precise enough for operating intelligence, open enough for creative work." },
      { type: "h2", text: "The E is three bars" },
      { type: "p", text: "Look at the second letter. The first E has no spine. It is three horizontal bars, and the middle one carries the only colour in the mark: a gradient that moves from deep blue to cyan, with its end cut on an angle as if it is still moving." },
      { type: "p", text: "We use those three bars on their own as our monogram. The outer bars are structure. The middle bar is the signal passing through it. That is a fair description of what we build: software that holds complex information steady so something useful can move through it." },
      { type: "quote", text: "Structure on the outside. A signal moving through the middle." },
      { type: "h2", text: "Blue to cyan" },
      { type: "p", text: "The gradient is not a mood. It is a direction. Deep blue is the operating picture: orders, payouts, costs, the facts of a business. Cyan is where those facts open into possibility: a campaign, a draft, a decision you can defend. Across the site, the gradient only appears where something is being connected." },
      { type: "h2", text: "The type system" },
      { type: "p", text: "Headlines use an extended, squared sans that echoes the wordmark without imitating it. Labels and body copy use a clean geometric sans with generous tracking in capitals, the same voice as “Systems Private Limited” beneath the wordmark. Codes and record identifiers use a monospace face, so a reference number never looks like marketing." },
      { type: "list", items: ["Navy ink for structure and reading.", "Blue to cyan for signal and connection.", "White space so the work can be seen.", "Motion that assembles, connects and resolves, never just decorates."] },
      { type: "h2", text: "AI, automation, robotics" },
      { type: "p", text: "The tagline under the logo names the territory we care about. Today that territory is expressed through two products, SeerFlow and Auctra. The tagline is a statement of focus, not a list of shipped products, and we will keep the difference clear as the company grows." },
    ],
  },
  {
    slug: "missing-input-is-not-zero",
    title: "Missing input is not zero",
    dek: "A blank cost field is a question, not an answer. How SeerFlow treats the gaps in a business picture.",
    category: "Product thinking",
    date: "2026-09-25",
    author: "Tetheric Systems",
    cover: "grid",
    body: [
      { type: "p", text: "Every operating dashboard has to decide what to do with an empty field. The easy choice is to treat it as zero. The number renders, the chart looks complete and nobody has to think about it. It is also how a business quietly misreads its own margins." },
      { type: "h2", text: "Why the easy default is dangerous" },
      { type: "p", text: "If the product cost for an order is missing and the system counts it as nothing, the order looks more profitable than it is. Multiply that across a catalogue and a month, and contribution becomes a comforting fiction. The error is invisible precisely because the interface looks finished." },
      { type: "quote", text: "An empty field should look like a question, because it is one." },
      { type: "h2", text: "What SeerFlow does instead" },
      { type: "p", text: "SeerFlow brings orders, payouts, costs and returns into one operating picture for Indian D2C teams. Part of that job is keeping sources and missing inputs visible. When a decision depends on a cost you have not supplied, the picture should say so, rather than smoothing the gap away." },
      { type: "list", items: ["Show which records a figure is built from.", "Mark the inputs that are missing, not just the ones that are present.", "Keep an estimate labelled as an estimate.", "Let the team decide what to fill in, instead of guessing for them."] },
      { type: "h2", text: "Clarity is not the same as completeness" },
      { type: "p", text: "A clear picture is one you can trust to be honest about its own edges. That is harder to design than a full-looking chart, and it matters more. Decision quality depends on connected records, provider coverage and the cost inputs a team actually supplies. We would rather show you the gap than hide it." },
    ],
  },
  {
    slug: "make-the-claim-show-the-work",
    title: "Make the claim. Show the work.",
    dek: "Six moves we use to describe complex products without overstating them.",
    category: "Philosophy",
    date: "2026-09-25",
    author: "Tetheric Systems",
    cover: "orbit",
    body: [
      { type: "p", text: "Writing about software is easy to get wrong in both directions. Say too little and nobody understands what a product does. Say too much and a pilot starts to sound like a platform, an illustration starts to sound like a customer result. We use a simple discipline to stay in the middle." },
      { type: "h2", text: "Six moves" },
      { type: "list", items: ["Name the object: the system, version, environment and source.", "Give it a state: live, pilot, prototype, simulation or concept.", "Attach the trail: the artifact, the method, the date.", "Draw the boundary: what the evidence does not establish.", "Show the denominator: a baseline, a sample, a period and an owner for any metric.", "Keep the record current: revisit the state when the facts change."] },
      { type: "quote", text: "A preview is not a deployment. A capability is not an audited outcome." },
      { type: "h2", text: "Why it matters to us" },
      { type: "p", text: "SeerFlow is a live product. Auctra is in a private pilot. Our illustrated interfaces are authored examples, not live accounts. Saying those things plainly costs nothing and earns something more useful than excitement: the reader’s confidence that the next thing we tell them is true." },
      { type: "p", text: "The full method, with examples from our own products, is published on our methodology page." },
    ],
  },
  {
    slug: "access-is-a-scope-action-is-a-decision",
    title: "Access is a scope. Action is a decision.",
    dek: "Why connecting an account and acting on it should never be the same step.",
    category: "Security",
    date: "2026-09-25",
    author: "Tetheric Systems",
    cover: "gate",
    body: [
      { type: "p", text: "Products that connect to other systems tend to blur two ideas together: being allowed to see something, and being allowed to change it. We keep them apart, on purpose, because the cost of confusing them is paid by the people who trusted the product." },
      { type: "h2", text: "Scope first" },
      { type: "p", text: "Access should be granted for a specific purpose and a specific source. In the private pilot of Auctra, the bridge to SeerFlow uses a brand-specific grant: the owner authorises the exact source brand, and the project requests a reporting window explicitly." },
      { type: "h2", text: "Then a decision" },
      { type: "p", text: "Preparing work is not publishing it. In Auctra, a saved draft is separate from destination-specific publishing approval. Preparing a plan does not publish content or activate advertising spend. The final call stays with a person." },
      { type: "quote", text: "Minimise what enters. Authorise who acts. Constrain what happens next." },
      { type: "list", items: ["Minimise: know what enters, why, where it moves and when it is removed.", "Authorise: scoped identities with ownership, rotation and revocation.", "Constrain: explicit policy, approval gates and safe failure modes.", "Retain the trail: inputs, policy version, actor, timestamp and result."] },
      { type: "p", text: "None of this is a certification claim. It is a design expectation we hold ourselves to, and our security page is explicit about what has and has not been independently assessed." },
    ],
  },
  {
    slug: "one-idea-two-products",
    title: "One idea, two products",
    dek: "Build the brand. Understand the business. Why SeerFlow and Auctra belong to the same family.",
    category: "Company",
    date: "2026-09-25",
    author: "Tetheric Systems",
    cover: "bridge",
    body: [
      { type: "p", text: "Most companies keep their creative work and their operating numbers in different rooms. The brand team imagines, the finance team reconciles, and the two rarely share context. We think that separation costs more than it saves." },
      { type: "h2", text: "Two points of view" },
      { type: "p", text: "Auctra is a creative workspace for brand research, ideas, copy, images and narrated video drafts: a team of AI specialists working with you, with every output reviewed by a person. SeerFlow is connected decision intelligence for Indian D2C: orders, payouts, costs and returns in one operating picture." },
      { type: "quote", text: "Creative ambition, grounded in what the business actually knows." },
      { type: "h2", text: "Context that flows both ways" },
      { type: "p", text: "Our direction is a connected journey from the first idea to the next informed decision. A campaign idea means more when it knows which products actually earn. An operating picture means more when it can see what the brand is trying to say." },
      { type: "p", text: "A brand-specific grant and a manual snapshot bridge between the two products exist in the private pilot. Source-side deployment and live data transfer remain separate steps, and brands are not connected by default. We will say more when that changes." },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

function blockText(block: Block) {
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "image") return block.caption ?? "";
  return block.text;
}

export function readingMinutes(post: Post) {
  const words = post.body.reduce((count, block) => count + blockText(block).split(/\s+/).length, post.dek.split(/\s+/).length);
  return Math.max(2, Math.round(words / 210));
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

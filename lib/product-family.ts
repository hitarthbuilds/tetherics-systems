/** Product-family domains verified over HTTPS on 20 September 2026. */
export const company = {
  name: "Tetheric Systems",
  legalName: "Tetheric Systems Private Limited",
  url: "https://tethericsystems.com",
  email: "hitarthdesai01@gmail.com",
};

export const products = {
  seerflow: {
    name: "SeerFlow",
    url: "https://seerflow.tethericsystems.com",
    record: "/records/seerflow",
    status: "Live product",
    purpose: "See what matters.",
    description: "Connected decision intelligence for Indian D2C. Bring orders, payouts, costs and returns into one operating picture.",
  },
  foundry: {
    name: "Apex Foundry",
    url: "https://foundry.tethericsystems.com",
    record: "/records/foundry",
    status: "Private pilot",
    purpose: "Make what matters.",
    description: "A creative workspace for brand research, ideas, copy, images and narrated video drafts. A team of AI specialists, working with you.",
  },
} as const;

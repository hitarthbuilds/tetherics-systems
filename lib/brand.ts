/**
 * Tetheric Systems brand geometry, traced from the official logo.
 * Units: the wordmark cap height is 120; every glyph shares a 20-unit stroke.
 */
export const brandColors = {
  navy: "#111D29",
  navyDeep: "#0A1520",
  blue: "#0B5FB4",
  blueDeep: "#0A4FA0",
  cyan: "#1CCDEA",
  white: "#FFFFFF",
} as const;

/** Blue → cyan, as in the logo's accent bar and rule. */
export const accentStops = [
  { offset: "0%", color: "#0A4FA0" },
  { offset: "52%", color: "#1284CB" },
  { offset: "100%", color: "#20D2EE" },
] as const;

/** A brighter ramp for dark surfaces, where the deep blue end would disappear into navy. */
export const accentStopsOnDark = [
  { offset: "0%", color: "#2B86E6" },
  { offset: "100%", color: "#2BD8F0" },
] as const;

const T = "M0 0H130V20H75.5V120H54.5V20H0Z";

/** TETHERIC. The first E is three bars; its middle bar carries the accent. */
export const wordmark = {
  width: 1188,
  height: 120,
  glyphs: [
    { x: 0, d: T },
    { x: 166, d: "M0 0H125V20H0ZM0 100H125V120H0Z" },
    { x: 326, d: T },
    { x: 491, d: "M0 0H21V50H107V0H128V120H107V70H21V120H0Z" },
    { x: 668, d: "M0 0H125V20H21V50H106V70H21V100H125V120H0Z" },
    {
      x: 833,
      d: "M0 0H97A30 30 0 0 1 127 30V48A30 30 0 0 1 97 78H41.3L28.1 58H97A10 10 0 0 0 107 48V30A10 10 0 0 0 97 20H26V54.8L3 20H0ZM0 50L24 86.4V120L0 96ZM52.7 62H76.7L132.4 120H108.4Z",
    },
    { x: 1004, d: "M0 0H21V120H0Z" },
    { x: 1066, d: "M40 0H122V20H40A20 20 0 0 0 20 40V80A20 20 0 0 0 40 100H122V120H40A40 40 0 0 1 0 80V40A40 40 0 0 1 40 0Z" },
  ],
  accent: { x: 166, d: "M0 50H124L111 70H0Z" },
  trademark: { x: 1192, y: -38, d: "M0 0H17V3.6H10.3V20H6.7V3.6H0ZM21 0H25.8L30.5 12.2L35.2 0H40V20H36.5V6.6L31.9 18.4H29.1L24.5 6.6V20H21Z" },
} as const;

/** The monogram: the logo's three-bar E, set on a 64-unit tile. */
export const monogram = {
  size: 64,
  bars: ["M14 14.7H50V20.5H14Z", "M14 43.5H50V49.3H14Z"],
  accent: "M14 29.1H49.7L46 34.9H14Z",
} as const;

export const lockupText = {
  descriptor: "SYSTEMS PRIVATE LIMITED",
  tagline: "AI | AUTOMATION | ROBOTICS",
} as const;

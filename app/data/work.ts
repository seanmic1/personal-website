/**
 * The clients behind "banks and financial institutions" in the Intro, named.
 *
 * Kept apart from the timeline on purpose: the timeline is ordered by date and
 * this is ordered by weight. The same engagements are named in the 2025 node
 * (`specialist`) and the on-call node (`swat`), so edit the three together.
 */

export type Engagement = {
  client: string;
  country: "Malaysia" | "Indonesia";
  /** What the system is. */
  system: string;
  /** What I did on it. */
  role: string;
};

/** Systems I designed, built or maintained. */
export const delivery: Engagement[] = [
  {
    client: "BFI Finance",
    country: "Indonesia",
    system: "Loan collection system",
    role: "Tech lead",
  },
  {
    client: "Adira Finance",
    country: "Indonesia",
    system: "Loan collection system",
    role: "Design and development",
  },
  {
    client: "Bank Islam (BIMB)",
    country: "Malaysia",
    system: "Loan origination system",
    role: "Developer",
  },
  {
    client: "SME Bank",
    country: "Malaysia",
    system: "Loan collection system",
    role: "Maintenance and upgrades",
  },
];

/** Critical production issues, as one of the on-call SWAT engineers. */
export const onCall: Engagement[] = [
  {
    client: "Tenaga Nasional Berhad",
    country: "Malaysia",
    system: "Outage management system",
    role: "Critical production incidents",
  },
  {
    client: "LPPSA",
    country: "Malaysia",
    system: "Batch processing",
    role: "Batch monitoring",
  },
  {
    client: "BFI Finance",
    country: "Indonesia",
    system: "End-of-day batch",
    role: "Monitoring, with immediate triage and fixes for data issues between JurisTech and BFI",
  },
];
